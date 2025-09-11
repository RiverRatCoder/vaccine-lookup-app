import React from 'react';
import styled from 'styled-components';
import { VaccineDetails } from '../types/vaccine';
import { formatDate, getSeverityColor } from '../utils/helpers';

const CardContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  animation: fadeIn 0.5s ease-out;
  margin: 20px 0;
`;

const CardHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 24px;
`;

const VaccineName = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 8px;
`;

const Manufacturer = styled.p`
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 0;
`;

const CardBody = styled.div`
  padding: 24px;
`;

const Section = styled.div`
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '';
    width: 4px;
    height: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px;
  }
`;

const SubsectionTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: #444;
  margin: 24px 0 12px 0;
  padding-left: 12px;
  border-left: 3px solid #667eea;
`;

const AdverseEffectsNote = styled.p`
  font-size: 0.9rem;
  line-height: 1.5;
  color: #666;
  background: #f0f4ff;
  padding: 12px 16px;
  border-radius: 6px;
  margin: 8px 0 16px 0;
  border: 1px solid #e1eaff;
  font-style: italic;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
`;

const InfoItem = styled.div`
  background: #f8f9ff;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #667eea;
`;

const InfoLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: #666;
  margin-bottom: 4px;
`;

const InfoValue = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
`;

const Description = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #666;
  background: #f8f9ff;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #667eea;
`;

const TrialCard = styled.div`
  background: #f8f9ff;
  border: 1px solid #e8eeff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const TrialHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 8px;
`;

const TrialPhase = styled.span`
  background: #667eea;
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.875rem;
  font-weight: 500;
`;

const TrialId = styled.span`
  color: #666;
  font-size: 0.875rem;
  font-family: monospace;
`;

const EffectCard = styled.div`
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const EffectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  flex-wrap: wrap;
  gap: 8px;
`;

const EffectName = styled.span`
  font-weight: 600;
  color: #333;
`;

const SeverityBadge = styled.span<{ $severity: string }>`
  background: ${props => getSeverityColor(props.$severity)};
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
`;

const OccurrenceRate = styled.div`
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 8px;
`;

const EffectDescription = styled.p`
  font-size: 0.875rem;
  color: #666;
  margin: 0;
`;

const EmptyState = styled.div`
  text-align: center;
  color: #999;
  font-style: italic;
  padding: 24px;
`;

interface VaccineCardProps {
  vaccine: VaccineDetails;
}

const VaccineCard: React.FC<VaccineCardProps> = ({ vaccine }) => {
  return (
    <CardContainer>
      <CardHeader>
        <VaccineName>{vaccine.name}</VaccineName>
        <Manufacturer>by {vaccine.manufacturer}</Manufacturer>
      </CardHeader>

      <CardBody>
        {/* Basic Information */}
        <Section>
          <SectionTitle>Basic Information</SectionTitle>
          <InfoGrid>
            {vaccine.fda_approved_date && (
              <InfoItem>
                <InfoLabel>FDA Approved</InfoLabel>
                <InfoValue>{formatDate(vaccine.fda_approved_date)}</InfoValue>
              </InfoItem>
            )}
            {vaccine.childhood_schedule_date && (
              <InfoItem>
                <InfoLabel>Added to Childhood Schedule</InfoLabel>
                <InfoValue>{formatDate(vaccine.childhood_schedule_date)}</InfoValue>
              </InfoItem>
            )}
            <InfoItem>
              <InfoLabel>Manufacturer</InfoLabel>
              <InfoValue>{vaccine.manufacturer}</InfoValue>
            </InfoItem>
          </InfoGrid>
          {vaccine.description && (
            <Description>{vaccine.description}</Description>
          )}
        </Section>

        {/* Clinical Trials */}
        <Section>
          <SectionTitle>Clinical Trials</SectionTitle>
          {vaccine.clinicalTrials.length > 0 ? (
            vaccine.clinicalTrials.map((trial) => (
              <TrialCard key={trial.id}>
                <TrialHeader>
                  <TrialPhase>{trial.trial_phase}</TrialPhase>
                  {trial.trial_identifier && (
                    <TrialId>{trial.trial_identifier}</TrialId>
                  )}
                </TrialHeader>
                <InfoGrid>
                  {trial.participant_count && (
                    <InfoItem>
                      <InfoLabel>Participants</InfoLabel>
                      <InfoValue>{trial.participant_count.toLocaleString()}</InfoValue>
                    </InfoItem>
                  )}
                  {trial.duration_months && (
                    <InfoItem>
                      <InfoLabel>Duration</InfoLabel>
                      <InfoValue>{trial.duration_months} months</InfoValue>
                    </InfoItem>
                  )}
                  {trial.monitoring_period_days && (
                    <InfoItem>
                      <InfoLabel>Monitoring Period</InfoLabel>
                      <InfoValue>{trial.monitoring_period_days} days after each dose</InfoValue>
                    </InfoItem>
                  )}
                  {(trial.age_range_min || trial.age_range_max) && (
                    <InfoItem>
                      <InfoLabel>Age Range</InfoLabel>
                      <InfoValue>
                        {trial.age_range_min ? Math.floor(trial.age_range_min / 12) : 0} - {trial.age_range_max ? Math.floor(trial.age_range_max / 12) : '∞'} years
                      </InfoValue>
                    </InfoItem>
                  )}
                  {trial.start_date && (
                    <InfoItem>
                      <InfoLabel>Trial Period</InfoLabel>
                      <InfoValue>
                        {formatDate(trial.start_date)}
                        {trial.end_date && ` - ${formatDate(trial.end_date)}`}
                      </InfoValue>
                    </InfoItem>
                  )}
                </InfoGrid>
                {trial.description && (
                  <Description>{trial.description}</Description>
                )}
              </TrialCard>
            ))
          ) : (
            <EmptyState>No clinical trial data available</EmptyState>
          )}
        </Section>

        {/* Adverse Effects */}
        <Section>
          <SectionTitle>Reported Adverse Effects</SectionTitle>
          {vaccine.adverseEffects.length > 0 ? (
            <>
              {/* Clinical Trial Adverse Effects */}
              {vaccine.adverseEffects.filter(effect => !effect.data_source || effect.data_source === 'clinical_trial').length > 0 && (
                <>
                  <SubsectionTitle>Clinical Trial Experience</SubsectionTitle>
                  <AdverseEffectsNote>
                    The following adverse reactions were observed during clinical trials conducted under widely varying conditions.
                  </AdverseEffectsNote>
                  {vaccine.adverseEffects
                    .filter(effect => !effect.data_source || effect.data_source === 'clinical_trial')
                    .map((effect) => (
                      <EffectCard key={effect.id}>
                        <EffectHeader>
                          <EffectName>{effect.effect_name}</EffectName>
                          <SeverityBadge $severity={effect.severity}>
                            {effect.severity}
                          </SeverityBadge>
                        </EffectHeader>
                        {effect.occurrence_rate != null && (
                          <OccurrenceRate>
                            Occurrence Rate: {Number(effect.occurrence_rate).toFixed(1)}%
                            {effect.reported_cases && (
                              ` (${effect.reported_cases.toLocaleString()} reported cases)`
                            )}
                          </OccurrenceRate>
                        )}
                        {effect.description && (
                          <EffectDescription>{effect.description}</EffectDescription>
                        )}
                      </EffectCard>
                    ))}
                </>
              )}

              {/* Post-Marketing Adverse Effects */}
              {vaccine.adverseEffects.filter(effect => effect.data_source === 'post_marketing').length > 0 && (
                <>
                  <SubsectionTitle>Post-Marketing Experience</SubsectionTitle>
                  <AdverseEffectsNote>
                    The following adverse reactions have been identified during post-approval use. Because these reactions are reported voluntarily from a population of uncertain size, it is not always possible to reliably estimate their frequency or establish a causal relationship to vaccine exposure.
                  </AdverseEffectsNote>
                  {vaccine.adverseEffects
                    .filter(effect => effect.data_source === 'post_marketing')
                    .map((effect) => (
                      <EffectCard key={effect.id}>
                        <EffectHeader>
                          <EffectName>{effect.effect_name}</EffectName>
                          <SeverityBadge $severity={effect.severity}>
                            {effect.severity}
                          </SeverityBadge>
                        </EffectHeader>
                        {effect.occurrence_rate != null && (
                          <OccurrenceRate>
                            Estimated Rate: {Number(effect.occurrence_rate).toFixed(3)}%
                            {effect.reported_cases && (
                              ` (${effect.reported_cases.toLocaleString()} reported cases)`
                            )}
                          </OccurrenceRate>
                        )}
                        {effect.description && (
                          <EffectDescription>{effect.description}</EffectDescription>
                        )}
                      </EffectCard>
                    ))}
                </>
              )}
            </>
          ) : (
            <EmptyState>No adverse effects data available</EmptyState>
          )}
        </Section>
      </CardBody>
    </CardContainer>
  );
};

export default VaccineCard;

