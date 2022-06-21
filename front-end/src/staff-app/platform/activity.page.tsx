import React, { useEffect } from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Spacing } from "shared/styles/styles"
import { useApi } from "shared/hooks/use-api"
import { Activity } from "shared/models/activity"
import { ActivityListTile } from "staff-app/components/activity-list-tile/activity-list-tile.component"
import { List, Typography } from "@material-ui/core"

export const ActivityPage: React.FC = () => {
  const [getActivities, data, loadState] = useApi<{activity: Activity[]}>({url: "get-activities"})

  useEffect(()=> {
    void getActivities()
  }, [getActivities])

  console.log(data?.activity);
  return (
    <S.Container>
      <Typography>
        Activity Page
      </Typography>
      {loadState === "loading" && (
        <CenteredContainer>
          <FontAwesomeIcon icon="spinner" size="2x" spin />
        </CenteredContainer>
      )}
      {loadState === "loaded" && data?.activity && (
        <List>
          {data.activity.map(item => {
            return <ActivityListTile activity={item.entity} key={item.entity.id}/>
          })}
        </List>
      )}
    </S.Container>
  )
}

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 0;
  `,
}
