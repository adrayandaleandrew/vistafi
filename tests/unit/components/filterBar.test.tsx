// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FilterBar } from '../../../src/components/FilterBar'

describe('FilterBar', () => {
  it('should apply active style to the currently active filter pill', () => {
    // Given
    const onChange = vi.fn()
    const onSearchChange = vi.fn()
    // When
    render(
      <FilterBar
        active="income"
        onChange={onChange}
        searchQuery=""
        onSearchChange={onSearchChange}
        sortBy="date-desc"
        onSortChange={vi.fn()}
      />
    )
    // Then
    const incomeButton = screen.getByRole('button', { name: 'Income' })
    expect(incomeButton).toHaveClass('bg-ink')
  })

  it('should call onChange with correct category value when pill is clicked', async () => {
    // Given
    const onChange = vi.fn()
    const onSearchChange = vi.fn()
    const user = userEvent.setup()
    render(
      <FilterBar
        active="all"
        onChange={onChange}
        searchQuery=""
        onSearchChange={onSearchChange}
        sortBy="date-desc"
        onSortChange={vi.fn()}
      />
    )
    // When
    await user.click(screen.getByRole('button', { name: 'Expense' }))
    // Then
    expect(onChange).toHaveBeenCalledWith('expense')
  })

  it('should call onSearchChange when user types in search input', async () => {
    // Given
    const onChange = vi.fn()
    const onSearchChange = vi.fn()
    const user = userEvent.setup()
    render(
      <FilterBar
        active="all"
        onChange={onChange}
        searchQuery=""
        onSearchChange={onSearchChange}
        sortBy="date-desc"
        onSortChange={vi.fn()}
      />
    )
    // When
    await user.type(screen.getByRole('searchbox'), 'groceries')
    // Then
    expect(onSearchChange).toHaveBeenCalled()
  })

  it('should show clear button when searchQuery is non-empty', () => {
    // Given / When
    render(
      <FilterBar
        active="all"
        onChange={vi.fn()}
        searchQuery="rent"
        onSearchChange={vi.fn()}
        sortBy="date-desc"
        onSortChange={vi.fn()}
      />
    )
    // Then
    expect(screen.getByRole('button', { name: 'Clear search' })).toBeInTheDocument()
  })

  it('should not show clear button when searchQuery is empty', () => {
    // Given / When
    render(
      <FilterBar
        active="all"
        onChange={vi.fn()}
        searchQuery=""
        onSearchChange={vi.fn()}
        sortBy="date-desc"
        onSortChange={vi.fn()}
      />
    )
    // Then
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument()
  })

  it('should call onSearchChange with empty string when clear button is clicked', async () => {
    // Given
    const onSearchChange = vi.fn()
    const user = userEvent.setup()
    render(
      <FilterBar
        active="all"
        onChange={vi.fn()}
        searchQuery="rent"
        onSearchChange={onSearchChange}
        sortBy="date-desc"
        onSortChange={vi.fn()}
      />
    )
    // When
    await user.click(screen.getByRole('button', { name: 'Clear search' }))
    // Then
    expect(onSearchChange).toHaveBeenCalledWith('')
  })

  // --- Sort tests (Task 13.1) ---

  it('should render a sort select with aria-label "Sort transactions"', () => {
    // Given / When
    render(
      <FilterBar
        active="all"
        onChange={vi.fn()}
        searchQuery=""
        onSearchChange={vi.fn()}
        sortBy="date-desc"
        onSortChange={vi.fn()}
      />
    )
    // Then
    expect(screen.getByRole('combobox', { name: 'Sort transactions' })).toBeInTheDocument()
  })

  it('should render sort select with exactly 4 options: Newest First, Oldest First, Amount High–Low, Amount Low–High', () => {
    // Given / When
    render(
      <FilterBar
        active="all"
        onChange={vi.fn()}
        searchQuery=""
        onSearchChange={vi.fn()}
        sortBy="date-desc"
        onSortChange={vi.fn()}
      />
    )
    // Then
    const select = screen.getByRole('combobox', { name: 'Sort transactions' })
    const options = Array.from((select as HTMLSelectElement).options).map(o => o.text)
    expect(options).toEqual(['Newest First', 'Oldest First', 'Amount High\u2013Low', 'Amount Low\u2013High'])
  })

  it('should have default selected value of "date-desc"', () => {
    // Given / When
    render(
      <FilterBar
        active="all"
        onChange={vi.fn()}
        searchQuery=""
        onSearchChange={vi.fn()}
        sortBy="date-desc"
        onSortChange={vi.fn()}
      />
    )
    // Then
    const select = screen.getByRole('combobox', { name: 'Sort transactions' }) as HTMLSelectElement
    expect(select.value).toBe('date-desc')
  })

  it('should call onSortChange with the selected value when sort select changes', async () => {
    // Given
    const onSortChange = vi.fn()
    const user = userEvent.setup()
    render(
      <FilterBar
        active="all"
        onChange={vi.fn()}
        searchQuery=""
        onSearchChange={vi.fn()}
        sortBy="date-desc"
        onSortChange={onSortChange}
      />
    )
    // When
    await user.selectOptions(screen.getByRole('combobox', { name: 'Sort transactions' }), 'amount-desc')
    // Then
    expect(onSortChange).toHaveBeenCalledWith('amount-desc')
  })

  it('should have min-height of 44px on the sort select (touch target rule)', () => {
    // Given / When
    render(
      <FilterBar
        active="all"
        onChange={vi.fn()}
        searchQuery=""
        onSearchChange={vi.fn()}
        sortBy="date-desc"
        onSortChange={vi.fn()}
      />
    )
    // Then
    const select = screen.getByRole('combobox', { name: 'Sort transactions' })
    expect(select).toHaveClass('min-h-[44px]')
  })
})
