import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';

import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { Draggable } from "react-beautiful-dnd";
import { Droppable } from "react-beautiful-dnd";

export default function Column({value, tasks, column}) {
  return <>
    <Grid key={value} item>
      <InputLabel sx={{marginBottom: "10px", color: "primary.main"}}>{value.toUpperCase()}</InputLabel>
      <Droppable droppableId={column}>
        {(droppableProvided, droppableSnapshot) => (
            <Paper
              sx={{
              minHeight: "40vh",
              maxHeight: "auto",
              width: "35vh",
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