import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import { NameSort } from "staff-app/daily-care/name-sort.component"
import { Search } from "staff-app/daily-care/search.component"

export const HomeBoardPage: React.FC = () => {
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [saveRoll] = useApi({url: "save-roll"})
  const [studentRollStates, setStudentRollStates] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState(null);
  const [sortBy, setSortBy] = useState("firstName");
  const [isRollMode, setIsRollMode] = useState(false)
  
  const [rollFilter, setRollFilter] = useState("all")
  const [filterResult, setFilterResult] = useState <any>([])
  

  useEffect(() => {
    void getStudents()
  }, [getStudents])

  useEffect(()=>{
    if(data?.students){
      setFilterResult(data.students)
    }
  }, [data, isRollMode])

  useEffect(()=>{
    setFilterResult(data?.students?.map(student=>{
      const index = studentRollStates.findIndex(el=>el["studentId"]===student.id)
      const { rollState } = index!==-1?studentRollStates[index]:"";
      return {
        ...student, 
        rollState
        }
    }))
  }, [studentRollStates, rollFilter])

  const onToolbarAction = (action: ToolbarAction) => {
    if (action === "roll" && isRollMode===false) {
      setIsRollMode(true)
      data?.students.forEach(student=>{
        setStudentRollStates((prevState: any) => {
          return [...prevState, {studentId:student.id, rollState:"unmark"}]
        })
      })
    }
  }

  const onActiveRollAction = (action: ActiveRollAction) => {
    
    if (action === "exit") {
      setIsRollMode(false)
      setStudentRollStates([])
      setFilterResult([])
      setRollFilter("all")
    }
    if(action === "save"){
      saveRoll({student_roll_states:studentRollStates})
      setIsRollMode(false)
      setStudentRollStates([])
      setFilterResult([])
      setRollFilter("all")
    }
  }

  return (
    <>
      <S.PageContainer>
        <Toolbar 
          onItemClick={onToolbarAction} 
          setSearchQuery={setSearchQuery}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          setSortBy={setSortBy}
        />

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && filterResult && (
          <>
            {filterResult.filter((student: { first_name: string; last_name: string }) => {
              if (searchQuery === '') {
                return student;
              } else if (student?.first_name.toLowerCase().includes(searchQuery.toLowerCase())
                || student.last_name.toLowerCase().includes(searchQuery.toLowerCase())
              ) {
                return student;
              } 
            }).sort((a: { first_name: string; last_name: string }, b: { first_name: string; last_name: string}) => {
              if(sortOrder==="asc"){
                if(sortBy==="firstName"){
                  if (a.first_name > b.first_name) {
                    return 1;
                  } else if (a.first_name < b.first_name) {
                    return -1;
                  }
                }
                else if(sortBy==="lastName") {
                  if (a.last_name > b.last_name) {
                    return 1;
                  } else if (a.last_name < b.last_name) {
                    return -1;
                  }
                }
              } else if(sortOrder==="desc"){
                if(sortBy==="firstName"){
                  if (a.first_name < b.first_name) {
                    return 1;
                  } else if (a.first_name > b.first_name) {
                    return -1;
                  }
                }
                else if(sortBy==="lastName") {
                  if (a.last_name < b.last_name) {
                    return 1;
                  } else if (a.last_name > b.last_name) {
                    return -1;
                  }
                }
              }
              return 1;  
            }).filter((s: { rollState: string })=>{
              if(isRollMode && rollFilter!=="all"){
                if(s.rollState===rollFilter){
                  return s
                }
              } else{
                return s
              }
             
            }).map((s: Person) => (
              <StudentListTile 
                key={s.id} 
                isRollMode={isRollMode} 
                student={s}
                studentRollStates={studentRollStates}
                setStudentRollStates={setStudentRollStates}
                rollFilter={rollFilter}
              /> 
            ))}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay 
        isActive={isRollMode} 
        onItemClick={onActiveRollAction} 
        studentRollStates={studentRollStates}
        rollFilter={rollFilter}
        setRollFilter = {setRollFilter}
      />
    </>
  )
}

type ToolbarAction = "roll" | "sort"
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void
  setSearchQuery:React.Dispatch<React.SetStateAction<string>>
  sortOrder:string | null
  setSortOrder:React.Dispatch<React.SetStateAction<any>>
  setSortBy:React.Dispatch<React.SetStateAction<string>>
}
const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick, setSearchQuery, sortOrder, setSortOrder, setSortBy } = props
  return (
    <S.ToolbarContainer>
      {/* <div onClick={() => onItemClick("sort")}>
        <FontAwesomeIcon icon="sort" size="1x" color="white"/>
        <span>First Name</span>
      </div> */}
      <NameSort 
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        setSortBy={setSortBy}
      />
      <Search setSearchQuery={setSearchQuery}/>
      <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer>
  )
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
    span {
      margin-left: ${Spacing.u2};
    }
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
}
