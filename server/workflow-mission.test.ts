import { describe, it, expect } from "vitest";
import { personalizeAgentPrompt, getPersonalizedAgentPrompt } from "./agent-personalization";

describe("Workflow Mission Integration", () => {
  it("should inject workflow mission at the beginning of agent prompt", () => {
    const basePrompt = "Tu es un expert en prospection B2B.";
    
    const config = {
      workflowMission: {
        objective: "Générer 50 leads qualifiés par mois pour notre restaurant italien à Montréal",
        kpis: "50 leads/mois, taux conversion 15%, coût par lead < 20$",
        timeline: "Mois 1-2: Setup, Mois 3-6: Optimisation",
        constraints: "Budget limité, éviter contenu trop promotionnel",
      },
    };

    const personalizedPrompt = personalizeAgentPrompt(basePrompt, config);

    // Mission should be at the beginning
    expect(personalizedPrompt).toContain("🎯 MISSION WORKFLOW");
    expect(personalizedPrompt).toContain("Générer 50 leads qualifiés");
    expect(personalizedPrompt).toContain("50 leads/mois");
    expect(personalizedPrompt).toContain("Mois 1-2: Setup");
    expect(personalizedPrompt).toContain("Budget limité");
    expect(personalizedPrompt).toContain("Ton rôle dans cette mission");
    
    // Base prompt should come after mission
    expect(personalizedPrompt.indexOf("MISSION WORKFLOW")).toBeLessThan(
      personalizedPrompt.indexOf("Tu es un expert")
    );
  });

  it("should inject mission with all context (business + goals + mission)", () => {
    const basePrompt = "Tu es un copywriter LinkedIn.";
    
    const config = {
      workflowMission: {
        objective: "Augmenter la notoriété de la marque et générer 100 leads B2B/mois",
        kpis: "100 leads/mois, 5000 followers LinkedIn, engagement rate 5%",
        timeline: "6 mois",
        constraints: "Ton professionnel, pas de hard selling",
      },
      businessInfo: {
        businessName: "TechCorp Solutions",
        address: "123 Rue Tech",
        city: "Montréal",
        province: "QC",
        postalCode: "H3B 2Y9",
        phone: "(514) 555-1234",
        website: "https://techcorp.com",
        sector: "b2b",
        description: "Solutions SaaS pour entreprises",
      },
      marketingGoals: {
        primaryGoal: "leads",
        leadsPerMonth: "100",
        budget: "2500-5000",
        targetAudience: "CTOs et VPs Engineering",
        uniqueSellingPoint: "Plateforme tout-en-un avec IA intégrée",
      },
    };

    const personalizedPrompt = personalizeAgentPrompt(basePrompt, config);

    // Mission first
    expect(personalizedPrompt).toContain("MISSION WORKFLOW");
    expect(personalizedPrompt).toContain("100 leads B2B/mois");
    
    // Then business context
    expect(personalizedPrompt).toContain("TechCorp Solutions");
    expect(personalizedPrompt).toContain("Montréal");
    
    // Then marketing goals
    expect(personalizedPrompt).toContain("CTOs et VPs Engineering");
    expect(personalizedPrompt).toContain("Plateforme tout-en-un");
    
    // Order verification: Mission → Business → Goals → Base Prompt
    const missionIndex = personalizedPrompt.indexOf("MISSION WORKFLOW");
    const businessIndex = personalizedPrompt.indexOf("CONTEXTE ENTREPRISE");
    const goalsIndex = personalizedPrompt.indexOf("OBJECTIFS MARKETING");
    const baseIndex = personalizedPrompt.indexOf("Tu es un copywriter");
    
    expect(missionIndex).toBeLessThan(businessIndex);
    expect(businessIndex).toBeLessThan(goalsIndex);
    expect(goalsIndex).toBeLessThan(baseIndex);
  });

  it("should work without mission (backward compatibility)", () => {
    const basePrompt = "Tu es un community manager.";
    
    const config = {
      businessInfo: {
        businessName: "Café Local",
        address: "456 Rue Café",
        city: "Québec",
        province: "QC",
        postalCode: "G1K 3X2",
        phone: "(418) 555-5678",
        website: "https://cafelocal.com",
        sector: "restaurant",
        description: "Café artisanal",
      },
    };

    const personalizedPrompt = personalizeAgentPrompt(basePrompt, config);

    // Should NOT contain mission section
    expect(personalizedPrompt).not.toContain("MISSION WORKFLOW");
    
    // Should still contain business info
    expect(personalizedPrompt).toContain("Café Local");
    expect(personalizedPrompt).toContain("Québec");
  });

  it("should handle partial mission (only objective and kpis)", () => {
    const basePrompt = "Tu es un analyste marketing.";
    
    const config = {
      workflowMission: {
        objective: "Doubler le trafic site web en 3 mois",
        kpis: "10000 visiteurs/mois, taux rebond < 40%",
        timeline: "",
        constraints: "",
      },
    };

    const personalizedPrompt = personalizeAgentPrompt(basePrompt, config);

    expect(personalizedPrompt).toContain("MISSION WORKFLOW");
    expect(personalizedPrompt).toContain("Doubler le trafic");
    expect(personalizedPrompt).toContain("10000 visiteurs/mois");
    
    // Should not show empty timeline/constraints
    expect(personalizedPrompt).not.toContain("Délai et étapes:**  ");
    expect(personalizedPrompt).not.toContain("Contraintes:**  ");
  });

  it("should inject mission in specific agent prompts", () => {
    const config = {
      workflowMission: {
        objective: "Générer 20 Reels viraux par mois pour augmenter followers de 10000",
        kpis: "20 Reels/mois, 10000 nouveaux followers, engagement rate 8%",
        timeline: "3 mois",
        constraints: "Contenu authentique, pas de clickbait",
      },
      businessInfo: {
        businessName: "Studio Créatif",
        address: "789 Rue Art",
        city: "Montréal",
        province: "QC",
        postalCode: "H2X 1Y7",
        phone: "(514) 555-9999",
        website: "https://studiocreatif.com",
        sector: "content-creation",
        description: "Studio de création vidéo",
      },
    };

    // Test with Veo 3 generator agent
    const veo3Prompt = getPersonalizedAgentPrompt("veo3-generator", config);
    
    expect(veo3Prompt).toContain("MISSION WORKFLOW");
    expect(veo3Prompt).toContain("20 Reels viraux");
    expect(veo3Prompt).toContain("Studio Créatif");
    expect(veo3Prompt).toContain("générateur de vidéos utilisant Veo 3");
    
    // Test with Scriptwriter agent
    const scriptwriterPrompt = getPersonalizedAgentPrompt("scriptwriter-reels", config);
    
    expect(scriptwriterPrompt).toContain("MISSION WORKFLOW");
    expect(scriptwriterPrompt).toContain("10000 nouveaux followers");
    expect(scriptwriterPrompt).toContain("scriptwriter expert en Reels");
  });
});
