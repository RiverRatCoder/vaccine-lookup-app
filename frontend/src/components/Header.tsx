import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #764ba2;
  }

  &::before {
    content: '🩺';
    margin-right: 10px;
    font-size: 1.8rem;
  }
`;

const Navigation = styled.nav`
  display: flex;
  gap: 30px;
  align-items: center;

  @media (max-width: 768px) {
    gap: 20px;
  }
`;

const NavLink = styled(Link)<{ $isActive: boolean }>`
  color: ${props => props.$isActive ? '#667eea' : '#666'};
  font-weight: ${props => props.$isActive ? '600' : '400'};
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  padding: 8px 0;

  &:hover {
    color: #667eea;
  }

  ${props => props.$isActive && `
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, #667eea, #764ba2);
      border-radius: 1px;
    }
  `}
`;

const Header: React.FC = () => {
  const location = useLocation();

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">
          Vaccine Lookup
        </Logo>
        <Navigation>
          <NavLink 
            to="/" 
            $isActive={location.pathname === '/'}
          >
            Home
          </NavLink>
          <NavLink 
            to="/about" 
            $isActive={location.pathname === '/about'}
          >
            About
          </NavLink>
        </Navigation>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;

