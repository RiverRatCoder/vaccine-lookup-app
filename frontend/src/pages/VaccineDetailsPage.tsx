import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import VaccineCard from '../components/VaccineCard';
import { useVaccine } from '../context/VaccineContext';
import { VaccineAPI } from '../services/api';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const PageContainer = styled.div`
  min-height: calc(100vh - 70px);
  padding: 40px 20px;
`;

const ContentWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Breadcrumb = styled.nav`
  margin-bottom: 32px;
`;

const BreadcrumbList = styled.ol`
  display: flex;
  align-items: center;
  gap: 8px;
  list-style: none;
`;

const BreadcrumbItem = styled.li`
  display: flex;
  align-items: center;
  
  &:not(:last-child)::after {
    content: '›';
    margin-left: 8px;
    color: rgba(255, 255, 255, 0.6);
    font-size: 1.2rem;
  }
`;

const BreadcrumbLink = styled(Link)`
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:hover {
    color: white;
  }
`;

const BreadcrumbCurrent = styled.span`
  color: white;
  font-weight: 500;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 24px;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
  }

  &::before {
    content: '←';
    font-size: 1rem;
  }
`;

const LoadingContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const ErrorContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 24px;
`;

const ErrorTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #e74c3c;
  margin-bottom: 16px;
`;

const ErrorMessage = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 24px;
  line-height: 1.6;
`;

const RetryButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: #5a6fd8;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const VaccineDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, setSelectedVaccine, setLoading, setError } = useVaccine();
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (id) {
      loadVaccineDetails(parseInt(id));
    } else {
      setError('Invalid vaccine ID');
    }
  }, [id, retryCount]);

  const loadVaccineDetails = async (vaccineId: number) => {
    try {
      setLoading(true);
      setError(null);
      const vaccine = await VaccineAPI.getVaccineById(vaccineId);
      setSelectedVaccine(vaccine);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load vaccine details';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const handleGoBack = () => {
    navigate('/');
  };

  if (state.loading) {
    return (
      <PageContainer>
        <ContentWrapper>
          <BackButton onClick={handleGoBack}>
            Back to Home
          </BackButton>
          
          <LoadingContainer>
            <Skeleton height={60} style={{ marginBottom: '20px' }} />
            <Skeleton height={40} style={{ marginBottom: '30px' }} />
            <Skeleton height={200} style={{ marginBottom: '20px' }} />
            <Skeleton height={150} style={{ marginBottom: '20px' }} />
            <Skeleton height={150} />
          </LoadingContainer>
        </ContentWrapper>
      </PageContainer>
    );
  }

  if (state.error) {
    return (
      <PageContainer>
        <ContentWrapper>
          <BackButton onClick={handleGoBack}>
            Back to Home
          </BackButton>
          
          <ErrorContainer>
            <ErrorIcon>😞</ErrorIcon>
            <ErrorTitle>Oops! Something went wrong</ErrorTitle>
            <ErrorMessage>
              {state.error}
              {state.error.includes('not found') && (
                <><br />The vaccine you're looking for might have been removed or the ID might be incorrect.</>
              )}
            </ErrorMessage>
            <RetryButton 
              onClick={handleRetry}
              disabled={state.loading}
            >
              {state.loading ? 'Retrying...' : 'Try Again'}
            </RetryButton>
          </ErrorContainer>
        </ContentWrapper>
      </PageContainer>
    );
  }

  if (!state.selectedVaccine) {
    return (
      <PageContainer>
        <ContentWrapper>
          <BackButton onClick={handleGoBack}>
            Back to Home
          </BackButton>
          
          <ErrorContainer>
            <ErrorIcon>🔍</ErrorIcon>
            <ErrorTitle>Vaccine Not Found</ErrorTitle>
            <ErrorMessage>
              The vaccine you're looking for could not be found in our database.
            </ErrorMessage>
            <RetryButton onClick={handleGoBack}>
              Back to Home
            </RetryButton>
          </ErrorContainer>
        </ContentWrapper>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ContentWrapper>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink to="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbCurrent>
                {state.selectedVaccine.name}
              </BreadcrumbCurrent>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <BackButton onClick={handleGoBack}>
          Back to Home
        </BackButton>

        <VaccineCard vaccine={state.selectedVaccine} />
      </ContentWrapper>
    </PageContainer>
  );
};

export default VaccineDetailsPage;

