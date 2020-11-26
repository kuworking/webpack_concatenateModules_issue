import React, { useState, useEffect, useRef } from 'react'
import { render } from 'react-dom'
import styled from 'styled-components'

const name = 'example'

function onload() {
  const anchor = document.getElementById(name) || null
  if (!anchor) return
  render(<Tool />, anchor)
}

window.addEventListener
  ? window.addEventListener('load', onload, false)
  : window.attachEvent && window.attachEvent('onload', onload)

/*
   -----------------------------------------------
   -----------------------------------------------
   -----------------------------------------------
  */

const q = u => `@media (min-width: ${u}px)`

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { useLocalStorage } from './hooks/uselocalstorage'

const colors = [
  {
    background: ['#ffd31d', '#fae7cb', '#ffb385', '#ff7272'],
    text: ['#000', '#000', '#000', '#000'],
  },
  {
    background: ['#481380', '#7f78d2', '#efb1ff', '#ffe2ff'],
    text: ['#fff', '#fff', '#000', '#000'],
  },
  {
    background: ['#00bdaa', '#400082', '#fe346e', '#f1e7b6'],
    text: ['#fff', '#fff', '#000', '#000'],
  },
  {
    background: ['#d63447', '#f57b51', '#f6eedf', '#d1cebd'],
    text: ['#fff', '#fff', '#000', '#000'],
  },
]

const data = [
  {
    columnId: 'd',
    text: 'Example 1',
    ref: 0,
    items: [
      {
        id: 'elemento-1',
        idNum: 1,
        text: 'Example 1',
      },
    ],
  },
  {
    columnId: 'a',
    text: 'Example 2',
    ref: 1,
    items: [
      {
        id: 'elemento-2',
        idNum: 2,
        text: 'Example 2',
      },
    ],
  },
  {
    columnId: 'f',
    text: 'Example 3',
    ref: 2,
    items: [
      {
        id: 'elemento-3',
        idNum: 3,
        text: 'Example 3',
      },
    ],
  },
  {
    columnId: 'o',
    text: 'Example 4',
    ref: 3,
    items: [
      {
        id: 'elemento-4',
        idNum: 4,
        text: 'Example 4',
      },
    ],
  },
]

const reorder = (list, startColumn, endColumn, startIndex, endIndex) => {
  const newList = Array.from(list)
  const startColumnIndex = newList.findIndex(item => item.columnId === startColumn)
  const endColumnIndex = newList.findIndex(item => item.columnId === endColumn)
  const [removed] = newList[startColumnIndex].items.splice(startIndex, 1)
  newList[endColumnIndex].items.splice(endIndex, 0, removed)
  return newList
}

export const Tool = data2 => {
  const [theCode, setTheCode] = useState([]) // show-hide the panel
  const theCodeRef = useRef()

  const refs = [useRef(), useRef(), useRef(), useRef()] // if inside data, then when storing it causes a JSON error
  const [dafo, setDafo] = useLocalStorage('kwdafo', JSON.parse(JSON.stringify(data)))
  const resetLocalStorage = () => setDafo(JSON.parse(JSON.stringify(data)))

  const onDragEnd = result => {
    const { destination, source, draggableId } = result

    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    const new_elements = reorder(dafo, source.droppableId, destination.droppableId, source.index, destination.index)
    setDafo(new_elements)
  }

  const addElement = panel => {
    const highestIndex = Math.max.apply(null, dafo.map(el => el.items.map(it => it.idNum)).flat()) + 1
    const index = dafo.findIndex(el => el.columnId === panel.columnId)
    const newDafo = [...dafo]
    newDafo[index].items = [
      { id: 'elemento-' + highestIndex, idNum: highestIndex, text: refs[panel.ref].current.value },
      ...dafo[index].items,
    ]
    setDafo(newDafo)
    refs[panel.ref].current.value = ''
  }

  const removeElement = el => {
    const index = dafo.findIndex(elem => elem.items.findIndex(it => it.id === el.id) !== -1)
    const newDafo = [...dafo]
    newDafo[index].items = dafo[index].items.filter(it => it.id !== el.id)
    setDafo(newDafo)
  }

  const Panel = ({ panel }) => (
    <>
      <div className="title">{panel.text}</div>
      <div className="panel">
        <Droppable droppableId={panel.columnId} key={panel.columnId}>
          {(provided, snapshot) => (
            <div ref={provided.innerRef}>
              {panel.items.map((el, i) => (
                <Draggable draggableId={el.id} index={i} key={el.id}>
                  {(provided, snapshot) => (
                    <Item ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      {el.text}
                    </Item>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <div>{/*expand*/}</div>
        <div>
          <TextArea ref={refs[panel.ref]} /> <Button onClick={() => addElement(panel)}>Add</Button>
        </div>
      </div>
    </>
  )

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <TheCode show={theCode.length ? 1 : 0} contenteditable="true">
        <div ref={theCodeRef}>
          {theCode.map((col, i) => (
            <React.Fragment key={`coprow1${i}`}>
              <div>{col.text}</div>
              <div>
                {col.items.map((it, j) => (
                  <div key={`coprow2${j}`}>{it.text}</div>
                ))}
              </div>
            </React.Fragment>
          ))}
        </div>
      </TheCode>

      <DragDropContext onDragEnd={onDragEnd}>
        <Grid palette={colors[0]}>
          {dafo.map((el, i) => (
            <Panel panel={el} key={`colum${i}`} />
          ))}
        </Grid>
      </DragDropContext>
    </div>
  )
}

const Item = styled.div``
const TextArea = styled.textarea`
  background: #fafafa;
  border-radius: 8px;
  width: -webkit-fill-available;
  margin-right: 10px;
  resize: none;
  height: 38px;
`
const Button = styled.button`
  border-radius: 8px;
  height: 40px;
  font-weight: 700;
  text-transform: uppercase;
  background: #ff0000b0;
  mix-blend-mode: luminosity;
  color: #fff;
  cursor: pointer;

  transition: 0.2s ease;
  &:hover {
    background: #000;
  }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 0px;

  & > div {
    padding: 20px;
    width: 100%;
  }

  & > div.panel {
    display: grid;
    flex-direction: row;
    ${q(800)} {
      display: flex;
    }

    & > div:nth-last-of-type(1) {
      display: flex;
      align-items: center;
      margin: 5px 0px;
      align-items: flex-end;
    }

    & > div:nth-last-of-type(2) {
      flex-grow: 1;
    }
  }

  & > div.title {
    font-size: 3em;
    margin-right: 20px;
    margin-top: 10px;
  }

  ${props =>
    props.palette.background.map(
      (_, n) => `
      & > div:nth-of-type(${2 * n + 1}),
      & > div:nth-of-type(${2 * n + 2}) {
        background: ${props.palette.background[n]};
        color: ${props.palette.text[n]};

        & > div {
          transition: all 0.2s ease;
        }
      }
  `
    )}

  ${Item} {
    display: flex;
    align-items: center;
    cursor: grab;
    border-radius: 3px;
    width: fit-content;
    padding: 2px 10px 2px 0px;
    text-transform: uppercase;
    width: 100%;
    font-weight: 700;

    transition: all 0.2s ease;
    &:hover {
      background: #ffffffb5;
    }

    & > img {
      width: 25px;
      height: 25px;
      margin-right: 10px;
      background: #ffffff69;
      padding: 5px;
      border-radius: 4px;
    }

    & > img:nth-of-type(2) {
      margin-right: 0px;
      margin-left: 10px;
      cursor: pointer;
      transition: all 0.2s ease;
      &:hover {
        background: #ff9696;
      }
    }
  }

  & > div > div:nth-of-type(1) {
    overflow: auto;
    border-radius: 3px;
    padding: 5px;
    margin: 5px 0px;
    font-weight: 700;
    text-align: center;
    text-transform: uppercase;
  }
`

const TheCode = styled.div`
  position: absolute;
  display: ${props => (props.show ? '' : 'none')};
  border: 1px solid #ccc;
  border-radius: 8px;
  max-width: 600px;
  min-width: 300px;
  width: max-content;
  z-index: 1;
  background: #fff;
  padding: 20px;

  & > div > div:nth-of-type(2n-1) {
    background: #dbc6f6;
    font-weight: 700;
    margin-top: 10px;
  }

  & > img {
    cursor: pointer;
    width: 30px;
    height: 30px;
    padding: 5px;
    border-radius: 8px;
    background: #eaeaea;

    &:hover {
      background: #ccc;
    }
  }
`
