import PageLayout from '../components/PageLayout'
import EnterpriseOverview from '../components/enterprise/EnterpriseOverview'
import YearlyEmissionTrend from '../components/enterprise/YearlyEmissionTrend'
import RegionDistribution from '../components/enterprise/RegionDistribution'
import IndustryShare from '../components/enterprise/IndustryShare'
import SourceAnalysis from '../components/enterprise/SourceAnalysis'
import HighEmissionTopRank from '../components/enterprise/HighEmissionTopRank'

export default function EnterprisePage() {
  return (
    <PageLayout
      showIndustry
      showUnitType
      left={(filters) => (
        <>
          <EnterpriseOverview />
          <YearlyEmissionTrend
            region={filters.region}
            industry={filters.industry}
          />
          <RegionDistribution region={filters.region} />
        </>
      )}
      right={
        <>
          <IndustryShare />
          <SourceAnalysis />
          <HighEmissionTopRank />
        </>
      }
    />
  )
}
