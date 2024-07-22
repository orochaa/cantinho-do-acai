import type { Complement, ComplementEvent } from './use-complements'
import { complementsReducer } from './use-complements'

describe('complementsReducer', () => {
  const countLimit = 5

  const initialState: Complement[] = [
    { name: 'Item 1', count: 2, countLimit },
    { name: 'Item 2', count: 1, countLimit },
  ]

  it('should add a complement if the total count is within the limit', () => {
    const event: ComplementEvent = {
      type: 'ADD',
      complement: { name: 'Item 1', count: 2, countLimit },
    }
    const newState = complementsReducer(initialState, event)

    expect(newState.find(c => c.name === 'Item 1')?.count).toBe(3)
  })

  it('should not add a complement if the total count exceeds the limit', () => {
    const event: ComplementEvent = {
      type: 'ADD',
      complement: { name: 'Item 1', count: 4, countLimit },
    }
    const newState = complementsReducer(initialState, event)

    expect(newState).toStrictEqual(initialState)
  })

  it('should not add a new complement to the list if it does not exist', () => {
    const event: ComplementEvent = {
      type: 'ADD',
      complement: { name: 'Item 3', count: 1, countLimit },
    }
    const newState = complementsReducer(initialState, event)

    expect(newState).toStrictEqual(initialState)
  })

  it('should remove a complement if its count is greater than 0', () => {
    const event: ComplementEvent = {
      type: 'REMOVE',
      complement: { name: 'Item 1', count: 2, countLimit },
    }
    const newState = complementsReducer(initialState, event)

    expect(newState.find(c => c.name === 'Item 1')?.count).toBe(1)
  })

  it('should not remove a complement if its count is 0', () => {
    const event: ComplementEvent = {
      type: 'REMOVE',
      complement: { name: 'Item 2', count: 0, countLimit },
    }
    const newState = complementsReducer(initialState, event)

    expect(newState).toStrictEqual(initialState)
  })
})
