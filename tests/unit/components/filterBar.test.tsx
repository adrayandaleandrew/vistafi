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
      />
    )
    // When
    await user.click(screen.getByRole('button', { name: 'Clear search' }))
    // Then
    expect(onSearchChange).toHaveBeenCalledWith('')
  })
})
