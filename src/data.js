export const DATA = [
    {
        "name":"York YMAE",
        "data":{
            "x":[75,120,130,130,140,140,120,75,75],
            "y":[-20,-20,0,20,30,80,110,110,-20]
        },
        "active":true
    },
    {
        "name":"Aermec NYK",
        "data":{
            "x":[70,115,125,125,135,135,115,70,70],
            "y":[-25,-25,-5,15,25,75,105,105,-25]
        },
        "active":true
    }
]

export var x_data = []
export var y_data = []

for (let i = 70; i < 150; i++) {
  for (let j = -30; j < 120; j++) { 
  x_data = [...x_data, i]
  y_data = [...y_data, j]
  }
}