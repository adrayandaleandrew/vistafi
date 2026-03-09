import { describe, it, expect } from 'vitest'
import { generateCsv } from '../../src/utils/csvExport'
import type { BudgetItem } from '@shared/types/budget'

const makeItem = (overrides: Partial<BudgetItem> = {}): BudgetItem => ({
  id: '1',
  description: 'Test',
  amount: 100,
  category: 'expense',
  date: '2023-11-01',
  ...overrides,
})

describe('generateCsv', () => {
  it('should return only the header row when given an empty array', () => {
    // Given / When
    const result = generateCsv([])
    // Then
    expect(result).toBe('Date,Description,Category,Amount')
  })

  it('should return header plus one data row with fields in order: date, description, category, amount', () => {
    // Given
    const item = makeItem({ date: '2023-11-05', description: 'Rent', category: 'expense', amount: 1500 })
    // When
    const result = generateCsv([item])
    // Then
    const lines = result.split('\n')
    expect(lines).toHaveLength(2)
    expect(lines[0]).toBe('Date,Description,Category,Amount')
    expect(lines[1]).toBe('2023-11-05,Rent,expense,1500')
  })

  it('should output amount as a plain number without currency symbol', () => {
    // Given
    const item = makeItem({ amount: 5000 })
    // When
    const result = generateCsv([item])
    // Then
    const dataRow = result.split('\n')[1]
    expect(dataRow).toContain('5000')
    expect(dataRow).not.toContain('$')
  })

  it('should wrap description containing a comma in double quotes', () => {
    // Given
    const item = makeItem({ description: 'Food, drink', amount: 50, date: '2023-11-10', category: 'expense' })
    // When
    const result = generateCsv([item])
    // Then
    const dataRow = result.split('\n')[1]
    expect(dataRow).toBe('2023-11-10,"Food, drink",expense,50')
  })

  it('should output category as lowercase as stored', () => {
    // Given
    const income = makeItem({ category: 'income', description: 'Salary', amount: 4000, date: '2023-11-01' })
    const savings = makeItem({ category: 'savings', description: 'Fund', amount: 500, date: '2023-11-02' })
    // When
    const result = generateCsv([income, savings])
    // Then
    const lines = result.split('\n')
    expect(lines[1]).toContain('income')
    expect(lines[2]).toContain('savings')
  })
})
