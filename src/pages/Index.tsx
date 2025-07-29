import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PlayerCard from "@/components/PlayerCard";
import HeadToHeadStats from "@/components/HeadToHeadStats";
import EventBreakdown from "@/components/EventBreakdown";
import player1Image from "@/assets/player1.jpg";
import player2Image from "@/assets/player2.jpg";

const Index = () => {
  // Sample data - in a real app this would come from an API
  const player1 = {
    name: "Giovanni Mpetshi Perricard",
    country: "FRA",
    countryCode: "fr",
    rank: 43,
    age: 22,
    weight: "216lbs (98kg)",
    height: "6'8\" (203cm)",
    plays: "Right-Handed",
    backhand: "One-Handed",
    turnedPro: 2021,
    image: player1Image
  };

  const player2 = {
    name: "Holger Rune",
    country: "DEN",
    countryCode: "dk",
    rank: 9,
    age: 22,
    weight: "169lbs (77kg)",
    height: "6'2\" (188cm)",
    plays: "Right-Handed",
    backhand: "Two-Handed",
    turnedPro: 2020,
    image: player2Image
  };

  const headToHeadData = {
    leftWins: 1,
    rightWins: 0,
    leftStats: {
      ytdWL: "9/15",
      ytdTitles: 1,
      careerWL: "27/30",
      careerTitles: 2,
      careerPrizeMoney: "$2,492,817"
    },
    rightStats: {
      ytdWL: "22/14",
      ytdTitles: 1,
      careerWL: "161/99",
      careerTitles: 5,
      careerPrizeMoney: "$13,760,337"
    }
  };

  const matchHistory = [
    {
      year: "2024",
      winner: "Giovanni Mpetshi Perricard",
      event: "Geneva Open",
      round: "Second Round",
      surface: "Clay",
      score: "6-4, 6-3"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section with diagonal pattern */}
        <div className="bg-gradient-to-r from-background via-card to-background py-12 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full bg-repeat" style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(66, 133, 244, 0.1) 10px,
                rgba(66, 133, 244, 0.1) 20px
              )`
            }}></div>
          </div>
        </div>

        {/* Players Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <PlayerCard {...player1} color="blue" />
          
          <div className="flex items-center justify-center">
            <HeadToHeadStats {...headToHeadData} />
          </div>
          
          <PlayerCard {...player2} color="yellow" />
        </div>

        {/* Event Breakdown */}
        <EventBreakdown matches={matchHistory} />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
