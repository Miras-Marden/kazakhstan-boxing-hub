import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import StatsCards from '@/components/home/StatsCards';
import TopRankings from '@/components/home/TopRankings';
import RecentResults from '@/components/home/RecentResults';
import UpcomingEvents from '@/components/home/UpcomingEvents';
import LatestNews from '@/components/home/LatestNews';

const Index = () => (
  <Layout>
    <HeroSection />
    <StatsCards />
    <TopRankings />
    <RecentResults />
    <UpcomingEvents />
    <LatestNews />
  </Layout>
);

export default Index;
