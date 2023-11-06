import { useState } from 'react'
import { DATA, x_data, y_data } from './data.js'
import Plot from 'react-plotly.js'
import { Typography, Button } from '@mui/material'
import robustPointInPolygon from 'robust-point-in-polygon'
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

const colorFromString = (str, alpha) => {
  var hash = 0,
    i, chr, color;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  hash = hash.toString(16)
  color = `rgba(${hash.substring(0, 2)},${hash.substring(2, 4)},${hash.substring(4, 6)},0.25)`
  return color;
}

const SimpleDialog = (props) => {
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose();
  };

  console.log(selectedValue)

  return (
    <Dialog onClose={handleClose} open={open} fullScreen>
      {selectedValue &&
        <>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <DialogTitle>
            {selectedValue['name']}
          </DialogTitle>

          <div style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>

            <Typography>
            </Typography>
            {['Q', 'COP', 'P'].map((value) => {
              return (
                <div style={{ flex: 1 }} key={value}>
                  <Plot data={[{
                    x: selectedValue[value]['x'],
                    y: selectedValue[value]['y'],
                    type: 'scatter',
                    hoverinfo: 'text',
                    showlegend: false
                  }]}
                    layout={{
                      title: value
                    }} />
                </div>
              )
            })}
          </div>
        </>
      }
    </Dialog>
  );
}


const App = () => {
  const [points, setPoints] = useState([[], []]);
  const [chillerData, setChillerData] = useState(DATA)
  const [selectedChiller, setSelectedChiller] = useState(null)
  const [open, setOpen] = useState(false);


  const chillerTraces = chillerData.filter((chiller) => {
    return chiller.active
  }).map((chiller) => {
    return {
      x: chiller['envelope']['x'],
      y: chiller['envelope']['y'],
      fill: 'toself',
      fillcolor: colorFromString(chiller['name'], 0.5),
      hoveron: 'fill+points',
      line: {
        color: colorFromString(chiller['name'], 1)
      },
      marker: {
        color: colorFromString(chiller['name'], 1)
      },
      hoverinfo: 'name',
      name: chiller['name']
    }
  })

  const handleClick = event => {
    const point = event.points[0];
    setPoints([[...points[0], point.x], [...points[1], point.y]])
    let temp = chillerData
    setChillerData(temp.map((chiller) => {
      var polygon = []
      for (var ii = 0; ii < chiller.envelope.x.length; ii++) {
        polygon = [...polygon, [chiller.envelope.x[ii], chiller.envelope.y[ii]]]
      }
      if (robustPointInPolygon(polygon, [point.x, point.y]) === 1) {
        chiller.active = false
      }
      return chiller
    }))
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const resetActive = () => {
    setPoints([[], []])
    setChillerData(chillerData.map((chiller) => {
      chiller.active = true
      return chiller
    }))
  }

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header>
        Heatpump Performance
      </header>
      <div style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
        <div style={{ flex: 1 }}>
          List of options
          {chillerData.map((chiller) => {
            return (
              <div key={chiller.name}>
                <Button onClick={() => { setSelectedChiller(chiller); handleClickOpen() }}>
                  <Typography color={chiller.active ? '#000' : '#999'}>
                    {chiller.name}
                  </Typography>
                </Button>

              </div>
            )
          })}
        </div>
        <div style={{ flex: 5, display: 'flex', flexDirection: 'column' }}>


          <div style={{ flex: 1 }}>
            <Button onClick={resetActive}>
              Clear Selected Points
            </Button>
            <Plot
              style={{ width: '100%', height: '100%' }}
              data={[
                ...chillerTraces,
                {
                  x: x_data,
                  y: y_data,
                  type: 'scatter',
                  hoverinfo: 'text',
                  mode: 'none',
                  showlegend: false
                },
                {
                  x: points[0],
                  y: points[1],
                  type: 'scatter',
                  hoverinfo: 'text',
                  mode: 'points',
                  showlegend: false,
                  stroke: 'rgba(0,0,0,0)'
                }
              ]}
              layout={{
                xaxis: {
                  range: [70, 150]
                },
                yaxis: {
                  range: [-30, 120]
                },
                legend: {
                  itemclick: false,
                  itemdoubleclick: false
                }
              }}
              onClick={handleClick}
            />
          </div>

        </div>
        <SimpleDialog
          selectedValue={selectedChiller}
          open={open}
          onClose={handleClose}
        />
      </div>
    </div>
  );
}

export default App;
