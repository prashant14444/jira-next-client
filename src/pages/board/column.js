import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';

import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { Draggable } from "react-beautiful-dnd";
import { Droppable } from "react-beautiful-dnd";

export default function Column({value, tasks, column}) {
  function stringToColor(string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
  }
  
  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
  }
  return <>
    <Grid key={value} item>
      <InputLabel sx={{marginBottom: "10px", color: "primary.main"}}>{value.toUpperCase()}</InputLabel>
      <Droppable droppableId={column}>
        {(droppableProvided, droppableSnapshot) => (
            <Paper
              sx={{
              minHeight: "40vh",
              maxHeight: "auto",
              width: "30vh",
              borderRadius: 1,
              border: 1,
              borderColor: 'primary.main',
              backgroundColor: "#F4F1F0"
              }}
              ref={droppableProvided.innerRef}
              {...droppableProvided.droppableProps}
            >
                {tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={`${task.id}`} index={index}>
                    {(draggableProvided, draggableSnapshot) => (
                    <Card 
                      key={task.id} 
                      sx={{ 
                            maxWidth: 345, margin:"20px", maxHeight: 300
                      }}
                      outlinecolor={ draggableSnapshot.isDragging ? "card-border" : "transparent"}
                      boxshadow={draggableSnapshot.isDragging  ? "0 5px 10px rgba(0, 0, 0, 0.6)"  : "unset"}
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                    >
                      <CardMedia
                        sx={{ height: 100 }}
                        image={"/static/images/cards/contemplative-reptile.jpg"}
                        title="green iguana"
                      />
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">{task.title}</Typography>
                      </CardContent>
                      <CardActions>
                        <CheckBoxIcon />
                        <Button size="small">RT-{index+1}</Button>
                        <Button size="small">Learn More</Button>
                        {task.assigned_to &&
                          <AvatarGroup max={4}>
                            <Avatar  
                              {...stringAvatar(`${task.assigned_to.user_id.f_name} ${task.assigned_to.user_id.l_name}`)} 
                              key={task.id} 
                              />
                          </AvatarGroup>
                        }
                      </CardActions>
                    </Card>
                    )}
                    </Draggable>
                ))}
            </Paper>
        )}
      </Droppable>
    </Grid>
  </>
}