import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const PageContainer = styled.div`
  min-height: calc(100vh - 70px);
  padding: 40px 20px;
`;

const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  margin-bottom: 32px;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
  }

  &::before {
    content: '←';
    font-size: 1rem;
  }
`;

const ContentCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 48px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    padding: 32px 24px;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 24px;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Section = styled.section`
  margin-bottom: 40px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '';
    width: 4px;
    height: 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px;
  }
`;

const Paragraph = styled.p`
  font-size: 1rem;
  line-height: 1.7;
  color: #666;
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 16px 0;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
  padding: 12px;
  background: #f8f9ff;
  border-radius: 8px;
  border-left: 4px solid #667eea;

  &::before {
    content: '✓';
    color: #667eea;
    font-weight: bold;
    font-size: 1.1rem;
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

const HighlightBox = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 24px;
  border-radius: 12px;
  margin: 24px 0;
`;

const HighlightTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 12px;
`;

const HighlightText = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  opacity: 0.95;
  margin: 0;
`;

const DataSourceBox = styled.div`
  background: #f8f9ff;
  border: 1px solid #e8eeff;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
`;

const ExternalLink = styled.a`
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const AboutPage: React.FC = () => {
  return (
    <PageContainer>
      <ContentWrapper>
        <BackButton to="/">
          Back to Home
        </BackButton>
        
        <ContentCard>
          <Title>About Vaccine Information Lookup</Title>
          
          <Section>
            <SectionTitle>Our Mission</SectionTitle>
            <Paragraph>
              The Vaccine Information Lookup application provides accurate, comprehensive, and 
              FDA-sourced information about vaccines to help individuals, parents, caregivers, 
              and healthcare professionals make informed decisions about immunization.
            </Paragraph>
            <Paragraph>
              We believe that access to transparent, scientifically-backed vaccine information 
              is essential for public health and individual healthcare decisions.
            </Paragraph>
          </Section>

          <HighlightBox>
            <HighlightTitle>FDA-Sourced Data</HighlightTitle>
            <HighlightText>
              All vaccine information in our database is sourced directly from the FDA's 
              official documentation and databases, ensuring accuracy and reliability.
            </HighlightText>
          </HighlightBox>

          <Section>
            <SectionTitle>What Information We Provide</SectionTitle>
            <FeatureList>
              <FeatureItem>
                <div>
                  <strong>FDA Approval Dates:</strong> When each vaccine was officially 
                  approved by the FDA for use in the United States.
                </div>
              </FeatureItem>
              <FeatureItem>
                <div>
                  <strong>Childhood Schedule Integration:</strong> When vaccines were 
                  added to the recommended childhood immunization schedule.
                </div>
              </FeatureItem>
              <FeatureItem>
                <div>
                  <strong>Manufacturer Information:</strong> Details about the companies 
                  that develop and produce each vaccine.
                </div>
              </FeatureItem>
              <FeatureItem>
                <div>
                  <strong>Clinical Trial Data:</strong> Comprehensive information about 
                  clinical trials including participant counts, duration, age ranges, 
                  and trial phases.
                </div>
              </FeatureItem>
              <FeatureItem>
                <div>
                  <strong>Adverse Effects:</strong> Documented adverse effects with 
                  occurrence rates and severity levels based on clinical trials and 
                  post-marketing surveillance.
                </div>
              </FeatureItem>
            </FeatureList>
          </Section>

          <Section>
            <SectionTitle>Data Sources</SectionTitle>
            <DataSourceBox>
              <Paragraph>
                <strong>Primary Source:</strong> U.S. Food and Drug Administration (FDA)
              </Paragraph>
              <Paragraph>
                Our application retrieves information from the FDA's official vaccine 
                documentation available at:{' '}
                <ExternalLink 
                  href="https://www.fda.gov/vaccines-blood-biologics/vaccines/vaccines-licensed-use-united-states"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  FDA Vaccines Licensed for Use in the United States
                </ExternalLink>
              </Paragraph>
            </DataSourceBox>
            <Paragraph>
              We also integrate data from clinical trial databases and FDA approval letters 
              to provide the most comprehensive information possible about each vaccine's 
              development and safety profile.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>Technology & Architecture</SectionTitle>
            <Paragraph>
              This application is built with modern web technologies designed for 
              scalability and future mobile app development:
            </Paragraph>
            <FeatureList>
              <FeatureItem>
                <div>
                  <strong>Frontend:</strong> React with TypeScript for type safety 
                  and component reusability
                </div>
              </FeatureItem>
              <FeatureItem>
                <div>
                  <strong>Backend:</strong> Node.js with Express.js for robust API 
                  development and data processing
                </div>
              </FeatureItem>
              <FeatureItem>
                <div>
                  <strong>Database:</strong> PostgreSQL for reliable structured data 
                  storage and complex queries
                </div>
              </FeatureItem>
              <FeatureItem>
                <div>
                  <strong>Mobile-Ready:</strong> Architecture designed to support 
                  future React Native mobile app development
                </div>
              </FeatureItem>
            </FeatureList>
          </Section>

          <Section>
            <SectionTitle>Important Disclaimer</SectionTitle>
            <Paragraph>
              This application provides informational content sourced from FDA databases 
              and documentation. It is not intended to replace professional medical advice, 
              diagnosis, or treatment. Always consult with qualified healthcare professionals 
              regarding vaccine decisions and medical questions.
            </Paragraph>
            <Paragraph>
              While we strive to maintain accuracy and update information regularly, 
              users should verify critical information with healthcare providers and 
              official FDA sources before making healthcare decisions.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>Future Development</SectionTitle>
            <Paragraph>
              We are committed to continuously improving this application with:
            </Paragraph>
            <FeatureList>
              <FeatureItem>
                <div>Regular data updates from FDA sources</div>
              </FeatureItem>
              <FeatureItem>
                <div>Enhanced search and filtering capabilities</div>
              </FeatureItem>
              <FeatureItem>
                <div>Mobile app development for iOS and Android</div>
              </FeatureItem>
              <FeatureItem>
                <div>Additional data visualizations and comparisons</div>
              </FeatureItem>
              <FeatureItem>
                <div>Integration with additional health data sources</div>
              </FeatureItem>
            </FeatureList>
          </Section>
        </ContentCard>
      </ContentWrapper>
    </PageContainer>
  );
};

export default AboutPage;

