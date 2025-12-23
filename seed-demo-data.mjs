import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

async function seed() {
  console.log("🌱 Seeding demo data...");
  
  try {
    // Get the owner user ID (should be ID 1)
    const userId = 1;
    
    // Create demo campaign
    console.log("Creating demo campaign...");
    const [campaignResult] = await connection.execute(
      `INSERT INTO campaigns (userId, name, targetIndustry, targetLocation, status, totalLeads, totalContent, totalPublished) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, "Restaurants Montréal - Démo", "restaurant", "Montréal, QC", "running", 5, 3, 1]
    );
    
    const campaignId = campaignResult.insertId;
    console.log(`✓ Campaign created with ID: ${campaignId}`);
    
    // Create demo leads
    console.log("Creating demo leads...");
    const demoLeads = [
      {
        userId,
        campaignId,
        businessName: "Restaurant Le Gourmet",
        businessType: "restaurant",
        address: "1234 Rue Saint-Denis, Montréal, QC H2X 3J5",
        city: "Montréal",
        province: "QC",
        postalCode: "H2X 3J5",
        phone: "(514) 555-1234",
        email: "contact@legourmet.ca",
        website: "https://legourmet.ca",
        googleRating: "4.5",
        googleReviews: 127,
        leadScore: 85,
        enriched: true,
      },
      {
        userId,
        campaignId,
        businessName: "Bistro Chez Marie",
        businessType: "restaurant",
        address: "567 Avenue du Mont-Royal, Montréal, QC H2T 2W3",
        city: "Montréal",
        province: "QC",
        postalCode: "H2T 2W3",
        phone: "(514) 555-5678",
        email: "info@chezmarie.com",
        website: "https://chezmarie.com",
        googleRating: "4.7",
        googleReviews: 234,
        leadScore: 92,
        enriched: true,
      },
      {
        userId,
        campaignId,
        businessName: "Café du Coin",
        businessType: "restaurant",
        address: "890 Rue Sherbrooke, Montréal, QC H3A 1G1",
        city: "Montréal",
        province: "QC",
        postalCode: "H3A 1G1",
        phone: "(514) 555-9012",
        website: "https://cafeducoin.ca",
        googleRating: "4.2",
        googleReviews: 89,
        leadScore: 72,
        enriched: false,
      },
      {
        userId,
        campaignId,
        businessName: "Pizzeria Bella Vista",
        businessType: "restaurant",
        address: "345 Boulevard Saint-Laurent, Montréal, QC H2Y 2Y7",
        city: "Montréal",
        province: "QC",
        postalCode: "H2Y 2Y7",
        phone: "(514) 555-3456",
        email: "contact@bellavista.ca",
        website: "https://bellavista.ca",
        googleRating: "4.6",
        googleReviews: 156,
        leadScore: 88,
        enriched: true,
      },
      {
        userId,
        campaignId,
        businessName: "Sushi Zen",
        businessType: "restaurant",
        address: "678 Rue Sainte-Catherine, Montréal, QC H3B 1B8",
        city: "Montréal",
        province: "QC",
        postalCode: "H3B 1B8",
        phone: "(514) 555-7890",
        email: "info@sushizen.ca",
        website: "https://sushizen.ca",
        googleRating: "4.8",
        googleReviews: 312,
        leadScore: 95,
        enriched: true,
      },
    ];
    
    for (const lead of demoLeads) {
      await connection.execute(
        `INSERT INTO leads (userId, campaignId, businessName, businessType, address, city, province, postalCode, phone, email, website, googleRating, googleReviews, leadScore, enriched) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [lead.userId, lead.campaignId, lead.businessName, lead.businessType || null, lead.address || null, lead.city || null, lead.province || null, lead.postalCode || null, lead.phone || null, lead.email || null, lead.website || null, lead.googleRating || null, lead.googleReviews || null, lead.leadScore, lead.enriched]
      );
    }
    console.log(`✓ Created ${demoLeads.length} demo leads`);
    
    // Create demo contents
    console.log("Creating demo contents...");
    const demoContents = [
      {
        userId,
        campaignId,
        leadId: 1,
        textContent: `🍽️ Découvrez l'excellence culinaire au Restaurant Le Gourmet!

Situé au cœur de Montréal, Le Gourmet vous propose une expérience gastronomique inoubliable. Notre chef passionné crée des plats raffinés avec des ingrédients locaux de première qualité.

✨ Ambiance chaleureuse et élégante
🍷 Carte des vins soigneusement sélectionnée
👨‍🍳 Cuisine française contemporaine

Réservez dès maintenant votre table pour une soirée mémorable!

#RestaurantMontréal #GastronomieQuébécoise #CuisineFrançaise #FoodiesMTL #MontréalEats`,
        imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
        hashtags: JSON.stringify(["#RestaurantMontréal", "#GastronomieQuébécoise", "#CuisineFrançaise", "#FoodiesMTL", "#MontréalEats"]),
        qualityScore: 88,
        status: "published",
        linkedinPostId: "urn:li:share:123456789",
        linkedinPostUrl: "https://www.linkedin.com/feed/update/urn:li:share:123456789",
        publishedAt: new Date(),
        likes: 42,
        comments: 8,
        shares: 5,
        impressions: 1250,
      },
      {
        userId,
        campaignId,
        leadId: 2,
        textContent: `🥐 Bistro Chez Marie - Votre refuge gourmand sur le Plateau!

Venez savourer l'authenticité d'un vrai bistro montréalais. Chez Marie, chaque plat raconte une histoire de passion et de tradition culinaire.

🌟 Brunch du weekend légendaire
🍳 Déjeuners copieux et réconfortants
☕ Café artisanal torréfié localement

Une adresse incontournable pour les amateurs de bonne bouffe!

#BistroMontréal #PlateauMontRoyal #BrunchMTL #CaféMontréal #RestaurantLocal`,
        imageUrl: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800",
        hashtags: JSON.stringify(["#BistroMontréal", "#PlateauMontRoyal", "#BrunchMTL", "#CaféMontréal", "#RestaurantLocal"]),
        qualityScore: 92,
        status: "approved",
      },
      {
        userId,
        campaignId,
        leadId: 4,
        textContent: `🍕 Pizzeria Bella Vista - L'Italie au cœur de Montréal!

Nos pizzas artisanales cuites au four à bois vous transportent directement en Italie. Pâte maison, ingrédients frais et recettes authentiques!

🔥 Four à bois traditionnel
🇮🇹 Recettes familiales italiennes
🧀 Fromages importés d'Italie

Commandez maintenant pour livraison ou venez déguster sur place!

#PizzaMontréal #CuisineItalienne #FourÀBois #MontréalFood #ItalianRestaurant`,
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800",
        hashtags: JSON.stringify(["#PizzaMontréal", "#CuisineItalienne", "#FourÀBois", "#MontréalFood", "#ItalianRestaurant"]),
        qualityScore: 85,
        status: "pending",
      },
    ];
    
    for (const content of demoContents) {
      await connection.execute(
        `INSERT INTO contents (userId, campaignId, leadId, textContent, imageUrl, hashtags, qualityScore, status, linkedinPostId, linkedinPostUrl, publishedAt, likes, comments, shares, impressions) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [content.userId, content.campaignId, content.leadId, content.textContent, content.imageUrl, content.hashtags, content.qualityScore, content.status, content.linkedinPostId || null, content.linkedinPostUrl || null, content.publishedAt || null, content.likes || 0, content.comments || 0, content.shares || 0, content.impressions || 0]
      );
    }
    console.log(`✓ Created ${demoContents.length} demo contents`);
    
    console.log("\n✅ Demo data seeded successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - 1 campaign created`);
    console.log(`   - ${demoLeads.length} leads generated`);
    console.log(`   - ${demoContents.length} contents created`);
    console.log(`   - 1 content published to LinkedIn`);
    
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
  
  process.exit(0);
}

seed();
