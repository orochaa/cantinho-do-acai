import type {
  Complement,
  ComplementEvent,
  ComplementState,
} from './use-complements'
import { complementsReducer } from './use-complements'

describe('complementsReducer', () => {
  const initialComplements: Complement[] = [
    { name: 'Item 1', count: 2 },
    { name: 'Item 2', count: 1 },
  ]

  const initialState: ComplementState = {
    countLimit: 5,
    countTotal: 3,
    complements: initialComplements,
  }

  it('should add a complement if the total count is within the limit', () => {
    const event: ComplementEvent = {
      type: 'ADD',
      complement: { name: 'Item 1', count: 2 },
    }
    const newState = complementsReducer(initialState, event)

    expect(newState.countTotal).toBe(initialState.countTotal + 1)
    expect(newState.countLimit).toBe(initialState.countLimit)
    expect(newState.complements.find(c => c.name === 'Item 1')?.count).toBe(3)
  })

  it('should not add a complement if the total count exceeds the limit', () => {
    const event: ComplementEvent = {
      type: 'ADD',
      complement: { name: 'Item 1', count: initialState.countLimit - 1 },
    }
    const newState = complementsReducer(initialState, event)

    expect(newState).toStrictEqual(initialState)
  })

  it('should not add a new complement to the list if it does not exist', () => {
    const event: ComplementEvent = {
      type: 'ADD',
      complement: { name: 'Item 3', count: 1 },
    }
    const newState = complementsReducer(initialState, event)

    expect(newState).toStrictEqual(initialState)
  })

  it('should remove a complement if its count is greater than 0', () => {
    const event: ComplementEvent = {
      type: 'REMOVE',
      complement: { name: 'Item 1', count: 2 },
    }
    const newState = complementsReducer(initialState, event)

    expect(newState.countTotal).toBe(initialState.countTotal - 1)
    expect(newState.countLimit).toBe(initialState.countLimit)
    expect(newState.complements.find(c => c.name === 'Item 1')?.count).toBe(1)
  })

  it('should not remove a complement if its count is 0', () => {
    const event: ComplementEvent = {
      type: 'REMOVE',
      complement: { name: 'Item 2', count: 0 },
    }
    const newState = complementsReducer(initialState, event)

    expect(newState).toStrictEqual(initialState)
  })
})
