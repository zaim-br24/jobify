import { FormRow, FormRowSelect } from './index'
import { useAppContext } from '../context/appContext'
import Wrapper from '../assets/wrappers/SearchContainer'


const SearchContainer = () => {
  const {
    isLoading,
    search,
    searchStatus,
    searchType,
    sort,
    sortOptions,
    statusOptions,
    jobTypeOptions,
    handleChange,
    clearFilters,
  } = useAppContext()

  const handleSubmit = (e)=>{
    e.preventdefault()
    clearFilters()
  }
  const handleSearch = (e) => {
    if (isLoading) return
    handleChange({ name: e.target.name, value: e.target.value })
  }

  return (
    <Wrapper>
    <form className='form'>
      <h4>search form</h4>
      {/* search position */}
      <div className='form-center'>
        <FormRow
          type='text'
          name='search'
          value={search}
          handleChange={handleSearch}
        ></FormRow>
        {/* search by status */}
        <FormRowSelect
          labelText='job status'
          name='searchStatus'
          value={searchStatus}
          handleChange={handleSearch}
          options={['all', ...statusOptions]}
        ></FormRowSelect>
        {/* search by type */}

        <FormRowSelect
          labelText='job type'
          name='searchType'
          value={searchType}
          handleChange={handleSearch}
          options={['all', ...jobTypeOptions]}
        ></FormRowSelect>
        {/* sort */}

        <FormRowSelect
          name='sort'
          value={sort}
          handleChange={handleSearch}
          options={sortOptions}
        ></FormRowSelect>
        <button
          className='btn btn-block btn-danger'
          disabled={isLoading}
          onClick={handleSubmit}
        >
          clear filters
        </button>
      </div>
    </form>
  </Wrapper>
  )
}

export default SearchContainer