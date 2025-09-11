import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import VaccineDropdown from '../components/VaccineDropdown';
import SupabaseTest from '../components/SupabaseTest';
import { useVaccine } from '../context/VaccineContext';
import { Vaccine } from '../types/vaccine';
import { VaccineAPI } from '../services/api';
import { toast } from 'react-toastify';

const PageContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  min-height: calc(100vh - 70px);
`;

const ContentWrapper = styled.div`
  max-width: 600px;
  width: 100%;
  text-align: center;
`;

const HeroSection = styled.div`
  margin-bottom: 48px;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: white;
  margin-bottom: 16px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

const SearchSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  margin-bottom: 32px;
  position: relative;
  z-index: 10;
  
  @media (max-width: 480px) {
    padding: 24px;
  }
`;

const SearchTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
`;

const SearchDescription = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 32px;
  line-height: 1.6;
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-top: 32px;
  position: relative;
  z-index: 1;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #666;
  font-weight: 500;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-top: 40px;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 24px;
  border-radius: 16px;
  text-align: left;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 16px;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

const FeatureDescription = styled.p`
  font-size: 0.875rem;
  color: #666;
  line-height: 1.6;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { state, setStats } = useVaccine();
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoadingStats(true);
      const stats = await VaccineAPI.getVaccineStats();
      setStats(stats);
    } catch (error) {
      console.error('Failed to load stats:', error);
      // Don't show error toast for stats as it's not critical
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleVaccineSelect = async (vaccine: Vaccine) => {
    try {
      navigate(`/vaccine/${vaccine.id}`);
      toast.success(`Loading information for ${vaccine.name}`);
    } catch (error) {
      toast.error('Failed to load vaccine information');
    }
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <HeroSection>
          <Title>Vaccine Information Lookup</Title>
          <Subtitle>
            Access accurate, FDA-sourced vaccine information including clinical trial data,
            adverse effects, and approval timelines for informed healthcare decisions.
          </Subtitle>
        </HeroSection>

        <SearchSection>
          <SearchTitle>Select a Vaccine</SearchTitle>
          <SearchDescription>
            Choose from our comprehensive database of FDA-approved vaccines to view
            detailed information including clinical trials and safety data.
          </SearchDescription>
          <SupabaseTest />
          <VaccineDropdown onVaccineSelect={handleVaccineSelect} />
        </SearchSection>

        {/* Statistics Section */}
        {(state.stats || isLoadingStats) && (
          <StatsSection>
            <StatCard>
              <StatNumber>
                {isLoadingStats ? <LoadingSpinner /> : state.stats?.totalVaccines || '0'}
              </StatNumber>
              <StatLabel>FDA-Approved Vaccines</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>
                {isLoadingStats ? <LoadingSpinner /> : state.stats?.totalClinicalTrials || '0'}
              </StatNumber>
              <StatLabel>Clinical Trials</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>
                {isLoadingStats ? <LoadingSpinner /> : state.stats?.totalAdverseEffects || '0'}
              </StatNumber>
              <StatLabel>Adverse Effects Tracked</StatLabel>
            </StatCard>
          </StatsSection>
        )}

        {/* Features Section */}
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>🔬</FeatureIcon>
            <FeatureTitle>Clinical Trial Data</FeatureTitle>
            <FeatureDescription>
              Access comprehensive clinical trial information including participant counts,
              duration, age ranges, and trial phases for each vaccine.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>⚠️</FeatureIcon>
            <FeatureTitle>Safety Information</FeatureTitle>
            <FeatureDescription>
              View detailed adverse effects data with occurrence rates and severity
              levels based on FDA post-marketing surveillance.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>📅</FeatureIcon>
            <FeatureTitle>Approval Timeline</FeatureTitle>
            <FeatureDescription>
              Track FDA approval dates and childhood immunization schedule additions
              to understand vaccine development history.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>🏢</FeatureIcon>
            <FeatureTitle>Manufacturer Info</FeatureTitle>
            <FeatureDescription>
              Learn about vaccine manufacturers and access official FDA documentation
              and approval letters for transparency.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </ContentWrapper>
    </PageContainer>
  );
};

export default HomePage;

