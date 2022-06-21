import React from "react";
import styled from "styled-components"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Roll, RollInput } from "shared/models/roll";
import { ListItem, ListItemAvatar, Avatar, ListItemText, IconButton } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RollStateList } from "../roll-state/roll-state-list.component";

interface Props {
    activity: Roll
}

export const ActivityListTile: React.FC<Props> = ({activity}) => {
	
	const day= new Date(activity.completed_at).getDay()
	const month = new Date(activity.completed_at).getMonth()
	const year = new Date(activity.completed_at).getFullYear()
	const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
	];

	console.log(activity)
	return(
		<ListItem>
			<ListItemAvatar>
				<Avatar>
					<FontAwesomeIcon icon="clipboard-list" size="lg" />
				</Avatar>
			</ListItemAvatar>
			<ListItemText primary={activity.name} secondary={`${day} ${monthNames[month]} ${year}`} />
			<RollStateList
				stateList={[
					{ type: "all", count: activity.student_roll_states.length },
					{ type: "present", count: activity.student_roll_states.filter(student=>student.rollState==="present").length },
					{ type: "late", count: activity.student_roll_states.filter(student=>student.rollState==="late").length },
					{ type: "absent", count: activity.student_roll_states.filter(student=>student.rollState==="absent").length },
				]}
				studentRollStates={activity.student_roll_states}
			/>
		</ListItem>
	)
}