import { useState } from 'react'
import { DATA, x_data, y_data } from './data'
import Plot from 'react-plotly.js'
import { Typography, Button } from '@mui/material'
import robustPointInPolygon from 'robust-point-in-polygon'
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import React from 'react'

const colorFromString = (str: String, alpha: number) => {
  var hash = 0,
    chr, color;
  for (let i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  const hashString: String = hash.toString(16)
  color = `rgba(${hashString.substring(0, 2)},${hashString.substring(2, 4)},${hashString.substring(4, 6)},${alpha})`
  return color;
}

interface XYArray {
  x: number[],
  y: number[],
}

interface PerformanceProperty {
  name: string,
  values: XYArray,
}

interface Chiller {
  name: string,
  envelope: XYArray,
  performance: PerformanceProperty[]
  active: boolean,
}

interface DialogProps {
  selectedValue: Chiller | null,
  open: boolean,
  onClose: () => void,
}

const PlotsDialog = (props: DialogProps) => {
  const { selectedValue, open, onClose } = props;

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
            {selectedValue.name}
          </DialogTitle>

          <div style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>

            <Typography>
            </Typography>
            {selectedValue.performance.map((value) => {
              return (
                <div style={{ flex: 1 }} key={value.name}>
                  <Plot data={[{
                    x: value.values.x,
                    y: value.values.y,
                    type: 'scatter',
                    hoverinfo: 'text',
                    showlegend: false
                  }]}
                    layout={{
                      title: value.name
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
  const [points, setPoints] = useState<XYArray>({ "x": [], "y": [] });
  const [chillerData, setChillerData] = useState(DATA)
  const [selectedChiller, setSelectedChiller] = useState<Chiller|null>(null)
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

  const handleClick = (event: Plotly.PlotMouseEvent) => {
    const point = event.points[0];
    const x = point.x
    const y = point.y
    if (typeof x == "number" && typeof y == "number") {
      setPoints({ "x": [...points.x, x], "y": [...points.y, y] })
      let temp = chillerData
      setChillerData(temp.map((chiller) => {
        var polygon : [number,number][] = []
        for (var ii = 0; ii < chiller.envelope.x.length; ii++) {
          polygon = [...polygon, [chiller.envelope.x[ii], chiller.envelope.y[ii]]]
        }
        if (robustPointInPolygon(polygon, [x, y]) === 1) {
          chiller.active = false
        }
        return chiller
      }))
    }
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const resetActive = () => {
    setPoints({ "x": [], "y": [] })
    setChillerData(chillerData.map((chiller) => {
      chiller.active = true
      return chiller
    }))
  }

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header>
      <Typography variant={'h4'}>
          Heatpumps
        </Typography>
      </header>
      <div style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
     
      
        <div style={{ flex: 1 }}>
        
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
            
            <Plot
              style={{ width: '100%', height: '80%' }}
              data={([
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
                  x: points.x,
                  y: points.y,
                  type: 'scatter',
                  hoverinfo: 'text',
                  mode: 'points',
                  showlegend: false,
                  stroke: 'rgba(0,0,0,0)'
                }
              ]) as Plotly.Data[]}
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
            <Button onClick={resetActive}>
              Clear Selected Points
            </Button>
          </div>
        </div>
        <PlotsDialog
          selectedValue={selectedChiller}
          open={open}
          onClose={handleClose}
        />
      </div>
    </div>
  );
}

export default App;
