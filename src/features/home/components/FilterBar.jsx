import { useDispatch, useSelector } from 'react-redux';
import { setFilters, clearFilters } from '../store/homeSlice';
import './FilterBar.css';

function FilterBar() {
  const dispatch = useDispatch();
  const { filters, companies, skills } = useSelector((state) => state.home);

  const handleFilterChange = (filterType, value) => {
    dispatch(setFilters({ [filterType]: value }));
  };

  const handleSearch = (value) => {
    dispatch(setFilters({ searchTerm: value }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  // Ensure arrays exist
  const companiesList = Array.isArray(companies) ? companies : [];
  const skillsList = Array.isArray(skills) ? skills : [];

  return (
    <div className="filter-bar">
      {/* Middle: Company & Skill Filters + Clear Button */}
      <div className="filter-middle">
        {/* Company Filter */}
        <select 
          className="filter-dropdown"
          value={filters.company || ''}
          onChange={(e) => handleFilterChange('company', e.target.value || null)}
        >
          <option value="">Company</option>
          {companiesList.map(company => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>

        {/* Skill Filter */}
        <select 
          className="filter-dropdown"
          value={filters.skill || ''}
          onChange={(e) => handleFilterChange('skill', e.target.value || null)}
        >
          <option value="">Skill</option>
          {skillsList.map(skill => (
            <option key={skill.id} value={skill.id}>
              {skill.name}
            </option>
          ))}
        </select>

        {/* Clear Filters Button */}
        {(filters.company || filters.skill) && (
          <button className="clear-btn" onClick={handleClearFilters}>
            Clear Filters ✕
          </button>
        )}
      </div>

      {/* Right: Search Input */}
      <div className="filter-right">
        <input 
          type="text"
          className="search-input"
          placeholder="Input a keyword"
          value={filters.searchTerm || ''}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
    </div>
  );
}

export default FilterBar;