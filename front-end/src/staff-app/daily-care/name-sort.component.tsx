import React from "react";
import styled from "styled-components"
import { ButtonGroup, Button, Popper, ClickAwayListener, Grow, Paper, MenuItem, MenuList } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FontWeight } from "shared/styles/styles";

const options = ['First name', 'Last name'];
interface NameSortProps {
  sortOrder:string | null
  setSortOrder:React.Dispatch<React.SetStateAction<string>>
  setSortBy:React.Dispatch<React.SetStateAction<string>>
}

export const NameSort: React.FC<NameSortProps> = (props) => {
    const [open, setOpen] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const anchorRef = React.useRef<HTMLDivElement>(null);
    const {sortOrder, setSortOrder, setSortBy } = props;
    const handleClick = () => {
      if(sortOrder === null || sortOrder==="desc"){
        setSortOrder("asc");
      }else if(sortOrder==="asc"){
        setSortOrder("desc")
      }
    };
  
    const handleMenuItemClick = (event, index) => {
      setSelectedIndex(index);
      if(index===0){
        setSortBy("firstName");
      } else if(index===1){
        setSortBy("lastName");
      }
      
      setOpen(false);
      
    };
  
    const handleToggle = () => {
      setOpen((prevOpen) => !prevOpen);
    };
  
    const handleClose = (event) => {
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
      }
  
      setOpen(false);
    };
  
    return (
      <React.Fragment>
        <ButtonGroup variant="outlined" ref={anchorRef} aria-label="sort button">
          <S.Button onClick={handleClick}>
            <FontAwesomeIcon icon="sort" size="2x"/>
          </S.Button>
          <S.Button 
            onClick={handleToggle}
            size="small"
            aria-controls={open ? 'split-button-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-label="select sort option"
          >
            {options[selectedIndex]}
          </S.Button>
          
        </ButtonGroup>
          <Popper
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === 'bottom' ? 'center top' : 'center bottom',
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList id="split-button-menu" autoFocusItem>
                      {options.map((option, index) => (
                        <MenuItem
                          key={option}
                          disabled={index === 2}
                          selected={index === selectedIndex}
                          onClick={(event) => handleMenuItemClick(event, index)}
                        >
                          Sort by {option}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
      </React.Fragment>
    );
}

const S = {
  Button: styled(Button)`
    && {
      justify-content: center;
      padding: 0px;
      color:white;
      border: none;
      text-transform: capitalize;
      font-weight: ${FontWeight.strong}
    }
  `,
}
