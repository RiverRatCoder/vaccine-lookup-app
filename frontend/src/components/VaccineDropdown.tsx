import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Vaccine } from '../types/vaccine';
import { useVaccine } from '../context/VaccineContext';
import { VaccineAPI } from '../services/api';
import { toast } from 'react-toastify';

const DropdownContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  z-index: 1000;
`;

const DropdownButton = styled.button<{ $isOpen: boolean }>`
  width: 100%;
  padding: 16px 20px;
  background: white;
  border: 2px solid ${props => props.$isOpen ? '#667eea' : '#e0e0e0'};
  border-radius: 12px;
  font-size: 1rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 56px;

  &:hover {
    border-color: #667eea;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  }

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const ButtonText = styled.span`
  color: #333;
  font-weight: 500;
`;

const PlaceholderText = styled.span`
  color: #999;
  font-weight: 400;
`;

const DropdownIcon = styled.div<{ $isOpen: boolean }>`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  transition: transform 0.3s ease;
  
  &::after {
    content: '▼';
    font-size: 12px;
    color: #666;
  }
`;

const DropdownList = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  max-height: 300px;
  overflow-y: auto;
  margin-top: 4px;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.$isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.3s ease;
`;

const GroupHeader = styled.div`
  padding: 12px 20px 8px 20px;
  background: #f8f9ff;
  border-bottom: 1px solid #e8eeff;
  font-weight: 600;
  font-size: 0.875rem;
  color: #667eea;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: sticky;
  top: 0;
  z-index: 1;
`;

const DropdownItem = styled.button<{ $isHighlighted?: boolean }>`
  width: 100%;
  padding: 12px 20px;
  background: ${props => props.$isHighlighted ? '#e8eeff' : 'none'};
  border: none;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #f0f0f0;

  &:hover {
    background-color: #f8f9ff;
  }

  &:last-child {
    border-bottom: none;
  }

  &:first-child {
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
  }

  &:last-child {
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
  }
`;

const VaccineName = styled.div`
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
`;

const VaccineManufacturer = styled.div`
  font-size: 0.875rem;
  color: #666;
`;

const LoadingText = styled.div`
  padding: 20px;
  text-align: center;
  color: #666;
  font-style: italic;
`;

const ErrorText = styled.div`
  padding: 20px;
  text-align: center;
  color: #e74c3c;
  font-size: 0.875rem;
`;

const SearchIndicator = styled.div`
  padding: 8px 20px;
  background: #f0f4ff;
  border-bottom: 1px solid #e8eeff;
  font-size: 0.875rem;
  color: #667eea;
  font-style: italic;
`;

const NoResultsText = styled.div`
  padding: 20px;
  text-align: center;
  color: #999;
  font-style: italic;
`;

interface VaccineDropdownProps {
  onVaccineSelect: (vaccine: Vaccine) => void;
  selectedVaccine?: Vaccine | null;
}

const VaccineDropdown: React.FC<VaccineDropdownProps> = ({
  onVaccineSelect,
  selectedVaccine
}) => {
  const { state, setVaccines, setLoading, setError } = useVaccine();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadVaccines();
  }, []);

  const loadVaccines = async () => {
    try {
      setLoading(true);
      const vaccines = await VaccineAPI.getAllVaccines();
      setVaccines(vaccines);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load vaccines';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleVaccineSelect = (vaccine: Vaccine) => {
    onVaccineSelect(vaccine);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('[data-dropdown]')) {
      setIsOpen(false);
      setSearchTerm('');
      setHighlightedIndex(-1);
    }
  };

  // Get filtered/flattened vaccines for keyboard navigation
  const getFilteredVaccines = () => {
    if (!searchTerm) return state.vaccines;
    
    return state.vaccines.filter(vaccine => 
      vaccine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vaccine.vaccine_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vaccine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Handle keyboard navigation
  const handleKeyDown = (event: KeyboardEvent) => {
    if (!isOpen) return;

    switch (event.key) {
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        break;
      case 'Enter':
        event.preventDefault();
        if (highlightedIndex >= 0) {
          const filteredVaccines = getFilteredVaccines();
          if (filteredVaccines[highlightedIndex]) {
            handleVaccineSelect(filteredVaccines[highlightedIndex]);
          }
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        setHighlightedIndex(prev => {
          const maxIndex = getFilteredVaccines().length - 1;
          return prev < maxIndex ? prev + 1 : 0;
        });
        break;
      case 'ArrowUp':
        event.preventDefault();
        setHighlightedIndex(prev => {
          const maxIndex = getFilteredVaccines().length - 1;
          return prev > 0 ? prev - 1 : maxIndex;
        });
        break;
      case 'Backspace':
        event.preventDefault();
        setSearchTerm(prev => {
          const newTerm = prev.slice(0, -1);
          setHighlightedIndex(-1);
          return newTerm;
        });
        break;
      default:
        // Only handle printable characters
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          event.preventDefault();
          setSearchTerm(prev => {
            const newTerm = prev + event.key.toLowerCase();
            setHighlightedIndex(0); // Auto-highlight first match
            return newTerm;
          });
        }
        break;
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('click', handleClickOutside);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, highlightedIndex, searchTerm]);

  return (
    <DropdownContainer data-dropdown ref={dropdownRef}>
      <DropdownButton
        $isOpen={isOpen}
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            setSearchTerm('');
            setHighlightedIndex(-1);
          }
        }}
        disabled={state.loading}
        tabIndex={0}
      >
        {selectedVaccine ? (
          <ButtonText>{selectedVaccine.name}</ButtonText>
        ) : (
          <PlaceholderText>
            {state.loading ? 'Loading vaccines...' : 'Select a vaccine to view information (click to open, then type to search)'}
          </PlaceholderText>
        )}
        <DropdownIcon $isOpen={isOpen} />
      </DropdownButton>

      <DropdownList $isOpen={isOpen}>
        {state.loading && (
          <LoadingText>Loading vaccines...</LoadingText>
        )}
        
        {state.error && (
          <ErrorText>{state.error}</ErrorText>
        )}
        
        {!state.loading && !state.error && state.vaccines.length === 0 && (
          <LoadingText>No vaccines available</LoadingText>
        )}

        {/* Search indicator */}
        {searchTerm && (
          <SearchIndicator>
            Searching for: "{searchTerm}" (Press Backspace to clear, Esc to close)
          </SearchIndicator>
        )}
        
        {!state.loading && !state.error && (() => {
          const filteredVaccines = getFilteredVaccines();
          
          if (searchTerm && filteredVaccines.length === 0) {
            return <NoResultsText>No vaccines found matching "{searchTerm}"</NoResultsText>;
          }

          if (searchTerm) {
            // If searching, show flat list with highlighting
            return filteredVaccines.map((vaccine: Vaccine, index: number) => (
              <DropdownItem
                key={vaccine.id}
                $isHighlighted={index === highlightedIndex}
                onClick={() => handleVaccineSelect(vaccine)}
              >
                <VaccineName>{vaccine.name}</VaccineName>
                <VaccineManufacturer>{vaccine.manufacturer}</VaccineManufacturer>
              </DropdownItem>
            ));
          }

          // Default grouped view
          const groupedVaccines = state.vaccines.reduce((groups: Record<string, Vaccine[]>, vaccine) => {
            const type = vaccine.vaccine_type || 'Other';
            if (!groups[type]) {
              groups[type] = [];
            }
            groups[type].push(vaccine);
            return groups;
          }, {} as Record<string, Vaccine[]>);

          return Object.entries(groupedVaccines).map(([type, vaccines]: [string, Vaccine[]]) => (
            <div key={type}>
              <GroupHeader>{type}</GroupHeader>
              {vaccines.map((vaccine: Vaccine) => (
                <DropdownItem
                  key={vaccine.id}
                  onClick={() => handleVaccineSelect(vaccine)}
                >
                  <VaccineName>{vaccine.name}</VaccineName>
                  <VaccineManufacturer>{vaccine.manufacturer}</VaccineManufacturer>
                </DropdownItem>
              ))}
            </div>
          ));
        })()}
      </DropdownList>
    </DropdownContainer>
  );
};

export default VaccineDropdown;

