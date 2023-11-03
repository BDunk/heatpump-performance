import { useState } from 'react'
import { DATA, x_data, y_data } from './data.js'
import Plot from 'react-plotly.js'
import { Typography, Button } from '@mui/material'
import robustPointInPolygon from 'robust-point-in-polygon'
const colorFromString = (str, alpha) => {
  var hash = 0,
    i, chr, color;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  hash = hash.toString(16)
  color = `rgba(${hash.substring(0,2)},${hash.substring(2,4)},${hash.substring(4,6)},0.25)`
  return color;
}

function App() {
  const [points, setPoints] = useState([[], []]);
  const [chillerData, setChillerData] = useState(DATA)
  const [selectedIndex, setSelectedIndex] = useState(null)

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
      marker:{
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
      for (var ii = 0; ii < chiller.envelope.x.length;ii++){
        polygon= [...polygon, [chiller.envelope.x[ii],chiller.envelope.y[ii]]]
      }
      if (robustPointInPolygon(polygon, [point.x, point.y])===1){
        chiller.active = false
      }
      return chiller
    }))
  }

  const resetActive = () =>{
    setPoints([[],[]])
    setChillerData(chillerData.map((chiller) => {
      chiller.active = true
      return chiller
    }))
  }

  return (
    <div>
      <header>
        Heatpump Performance
      </header>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ flex: 1 }}>
          List of options
          {chillerData.map((chiller, index) => {
            return (
              <div key={chiller.name}>
                <Button onClick={()=>setSelectedIndex(index)}>
                  <Typography color={chiller.active ? '#000':'#999'}>
                    {chiller.name}
                  </Typography>
                </Button>
                
              </div>
            )
          })}
        </div>
        <div style={{ flex: 3 }}>
          <Button onClick={resetActive}>
            Clear Selected Points
          </Button>
          <Plot
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
              legend:{
                itemclick:false,
                itemdoubleclick:false
              }
            }}
            onClick={handleClick}
          />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>            
      {selectedIndex !== null ?
      <>
      <Typography>
        {chillerData[selectedIndex]['name']}
      </Typography>
      <div style={{flex:1}}>
            <Plot data={[{
            x: chillerData[selectedIndex]['Q']['x'],
            y: chillerData[selectedIndex]['Q']['y'],
            type: 'scatter',
            hoverinfo: 'text',
            showlegend: false
          }]}
          layout={{
            title: 'Q'
          }}/>
          </div>
          <div style={{flex:1}}>
            <Plot data={[{
            x: chillerData[selectedIndex]['COP']['x'],
            y: chillerData[selectedIndex]['COP']['y'],
            type: 'scatter',
            hoverinfo: 'text',
            showlegend: false
          }]}
          layout={{
            title: 'COP'
          }}/>
          </div>
          <div style={{flex:1}}>
            <Plot data={[{
            x: chillerData[selectedIndex]['P']['x'],
            y: chillerData[selectedIndex]['P']['y'],
            type: 'scatter',
            hoverinfo: 'text',
            showlegend: false
          }]}
          layout={{
            title: 'P'
          }}/>
          </div>

      </>
           
            
            
             :''}
      </div>
    </div>
  );
}

export default App;
