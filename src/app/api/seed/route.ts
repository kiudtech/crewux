import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/lib/db";

export async function POST() {
  try {
    // Create Super Admin
    const adminPassword = await hash("admin123", 12);
    await db.user.upsert({
      where: { email: "admin@gigbharat.in" },
      update: {},
      create: {
        email: "admin@gigbharat.in",
        password: adminPassword,
        role: "SUPER_ADMIN",
        emailVerified: true,
      },
    });

    // Create sample volunteer
    const volPassword = await hash("volunteer123", 12);
    await db.user.upsert({
      where: { email: "volunteer@demo.com" },
      update: {},
      create: {
        email: "volunteer@demo.com",
        password: volPassword,
        role: "VOLUNTEER",
        volunteerProfile: {
          create: {
            fullName: "Rahul Sharma",
            college: "IIT Delhi",
            course: "B.Tech",
            discipline: "Computer Science",
            yearOfStudy: "3",
            skills: JSON.stringify(["Web Development", "Machine Learning", "Public Speaking"]),
            interests: JSON.stringify(["Hackathons", "AI Summit", "Tech Fest"]),
            availability: "WEEKENDS",
            city: "New Delhi",
            state: "Delhi",
            bio: "Passionate about technology and volunteering.",
          },
        },
      },
    });

    // Create sample organization
    const orgPassword = await hash("org123", 12);
    await db.user.upsert({
      where: { email: "org@demo.com" },
      update: {},
      create: {
        email: "org@demo.com",
        password: orgPassword,
        role: "ORGANIZATION",
        organizationProfile: {
          create: {
            organizationName: "TechCorp India",
            type: "CORPORATE",
            officialEmail: "org@demo.com",
            contactPerson: "Priya Patel",
            website: "https://techcorp.in",
            city: "Bangalore",
            state: "Karnataka",
            shortDescription: "Leading tech company focused on AI and community engagement.",
            verificationStatus: "VERIFIED",
          },
        },
      },
    });

    // Create sample college
    const collegePassword = await hash("college123", 12);
    await db.user.upsert({
      where: { email: "college@demo.com" },
      update: {},
      create: {
        email: "college@demo.com",
        password: collegePassword,
        role: "COLLEGE",
        collegeProfile: {
          create: {
            collegeName: "Delhi Technical University",
            officialEmail: "college@demo.com",
            contactPerson: "Dr. Anand Kumar",
            website: "https://dtu.ac.in",
            city: "New Delhi",
            state: "Delhi",
            affiliatedUniversity: "Delhi University",
            totalStudents: 5000,
          },
        },
      },
    });

    // Get org user for creating events
    const orgUser = await db.user.findUnique({ where: { email: "org@demo.com" } });
    
    if (orgUser) {
      // Create sample events
      const now = new Date();
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 15);
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const twoWeeks = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
      const threeWeeks = new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000);

      const sampleEvents = [
        {
          title: "National Innovation Hackathon 2025",
          description: "Join India's biggest innovation hackathon! Build solutions for real-world problems across healthcare, education, and sustainability. Teams of 2-4 will compete over 36 hours with mentoring from industry experts.\n\nWhat to expect:\n- 36-hour non-stop coding marathon\n- Industry mentors from top companies\n- Networking with 500+ developers\n- Amazing prizes worth ₹5,00,000\n\nWe need dedicated volunteers to help manage registrations, technical infrastructure, mentor coordination, and stage management.",
          shortDesc: "36-hour hackathon focused on innovation in healthcare, education & sustainability",
          category: "HACKATHON",
          eventType: "IN_PERSON",
          status: "PUBLISHED",
          startDate: nextMonth,
          endDate: new Date(nextMonth.getTime() + 2 * 24 * 60 * 60 * 1000),
          registrationDeadline: nextWeek,
          venue: "IIT Delhi Campus",
          address: "Hauz Khas, New Delhi",
          city: "New Delhi",
          state: "Delhi",
          totalSlots: 25,
          filledSlots: 3,
          requiredSkills: JSON.stringify(["Event Management", "Technical Support", "Photography", "Social Media Marketing"]),
          rolesNeeded: JSON.stringify([
            { role: "Registration Desk", count: 5, description: "Manage participant check-in and registration" },
            { role: "Technical Support", count: 4, description: "Help with WiFi, projectors, and tech setup" },
            { role: "Photography", count: 3, description: "Capture event moments" },
            { role: "Stage Management", count: 2, description: "Manage opening/closing ceremonies" },
          ]),
          perks: "Certificate of volunteering, free meals, hackathon swag kit, networking with industry leaders",
          eligibility: "College students and recent graduates. Must be available for the full duration.",
          contactEmail: "hackathon@techcorp.in",
          contactPhone: "+91 98765 43210",
        },
        {
          title: "AI & Data Science Summit",
          description: "A two-day summit bringing together AI researchers, data scientists, and industry professionals. Featuring keynote speeches, panel discussions, hands-on workshops, and a poster presentation session.\n\nTopics include:\n- Large Language Models & GenAI\n- Computer Vision applications\n- MLOps at scale\n- Ethical AI and responsible development\n\nVolunteers will help with event coordination, speaker hospitality, session management, and attendee support.",
          shortDesc: "Two-day summit on AI, ML & Data Science with workshops and panel discussions",
          category: "SUMMIT",
          eventType: "HYBRID",
          status: "PUBLISHED",
          startDate: twoWeeks,
          endDate: new Date(twoWeeks.getTime() + 1 * 24 * 60 * 60 * 1000),
          venue: "Bangalore International Exhibition Centre",
          city: "Bangalore",
          state: "Karnataka",
          virtualLink: "https://meet.google.com/abc-defg-hij",
          totalSlots: 15,
          filledSlots: 1,
          requiredSkills: JSON.stringify(["Communication", "Event Management", "Content Writing"]),
          rolesNeeded: JSON.stringify([
            { role: "Volunteer Coordinator", count: 2, description: "Coordinate all volunteer activities" },
            { role: "Hospitality", count: 4, description: "Speaker & VIP management" },
            { role: "Social Media Handler", count: 3, description: "Live tweeting and Instagram updates" },
          ]),
          perks: "Free summit pass (worth ₹5,000), certificate, lunch & refreshments",
          eligibility: "Open to all. Prior event management experience preferred.",
          contactEmail: "summit@techcorp.in",
        },
        {
          title: "Clean India — CSR Beach Cleanup Drive",
          description: "Be part of a massive cleanup drive along Mumbai's coastline. We're organizing a CSR initiative to clean Versova Beach and Juhu Beach as part of our annual sustainability commitment.\n\nActivities:\n- Beach cleaning and waste segregation\n- Awareness campaign for beachgoers\n- Data collection on marine waste\n- Tree planting along the coast\n\nNo special skills required — just bring your energy and willingness to make a difference!",
          shortDesc: "Join our beach cleanup drive along Mumbai coastline — make a difference!",
          category: "CSR_DRIVE",
          eventType: "IN_PERSON",
          status: "PUBLISHED",
          startDate: threeWeeks,
          endDate: threeWeeks,
          venue: "Versova Beach",
          city: "Mumbai",
          state: "Maharashtra",
          totalSlots: 50,
          filledSlots: 8,
          requiredSkills: JSON.stringify(["Teamwork", "Community Outreach"]),
          rolesNeeded: JSON.stringify([
            { role: "General Volunteer", count: 40, description: "Beach cleanup and waste segregation" },
            { role: "Photography", count: 3, description: "Document the drive" },
            { role: "Volunteer Coordinator", count: 2, description: "Lead teams of volunteers" },
          ]),
          perks: "Certificate, branded t-shirt, refreshments, social impact recognition",
          eligibility: "Open to all ages 16+. Bring sunscreen and comfortable clothes!",
          contactEmail: "csr@techcorp.in",
          contactPhone: "+91 98765 43211",
        },
        {
          title: "Full-Stack Web Development Workshop",
          description: "A hands-on weekend workshop covering modern full-stack web development with React, Next.js, and Node.js.\n\nCurriculum:\n- Day 1: React fundamentals & component patterns\n- Day 1: Next.js App Router & server components\n- Day 2: Backend APIs with Node.js\n- Day 2: Database with Prisma & deployment\n\nWe need teaching assistants and logistics volunteers to help run this smoothly.",
          shortDesc: "Weekend workshop on React, Next.js & Node.js — learn by building!",
          category: "WORKSHOP",
          eventType: "VIRTUAL",
          status: "PUBLISHED",
          startDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
          endDate: new Date(now.getTime() + 11 * 24 * 60 * 60 * 1000),
          virtualLink: "https://zoom.us/j/1234567890",
          totalSlots: 8,
          filledSlots: 0,
          requiredSkills: JSON.stringify(["Web Development", "Teaching", "Mentoring"]),
          rolesNeeded: JSON.stringify([
            { role: "Mentor", count: 4, description: "Help participants with coding exercises" },
            { role: "Technical Support", count: 2, description: "Manage Zoom sessions and recordings" },
          ]),
          perks: "Certificate, free access to workshop materials, networking with instructors",
          eligibility: "Must have experience with React/Next.js to mentor. TAs should have basic web dev knowledge.",
          contactEmail: "workshops@techcorp.in",
        },
        {
          title: "TechCorp Annual Tech Fest 2025",
          description: "Our flagship annual tech festival featuring coding competitions, robotics showcase, gaming tournaments, and tech talks by industry leaders.\n\n3-day event with:\n- Coding competitions (competitive programming)\n- Robotics demonstrations\n- Gaming tournaments\n- Tech talks & panel discussions\n- Startup pitch competition\n- Career fair\n\nWe need a large volunteer team to make this event a success!",
          shortDesc: "Annual tech fest — coding competitions, robotics, gaming & more!",
          category: "TECH_FEST",
          eventType: "IN_PERSON",
          status: "DRAFT",
          startDate: new Date(now.getFullYear(), now.getMonth() + 2, 1),
          endDate: new Date(now.getFullYear(), now.getMonth() + 2, 3),
          venue: "TechCorp Campus",
          address: "Electronic City Phase 1",
          city: "Bangalore",
          state: "Karnataka",
          totalSlots: 40,
          filledSlots: 0,
          requiredSkills: JSON.stringify(["Event Management", "Technical Support", "Photography", "Videography", "Social Media Marketing", "Leadership"]),
          rolesNeeded: JSON.stringify([
            { role: "Volunteer Coordinator", count: 3, description: "Lead volunteer teams" },
            { role: "Registration Desk", count: 6, description: "Handle 2000+ registrations" },
            { role: "Technical Support", count: 5, description: "AV equipment and tech setup" },
            { role: "MC / Anchor", count: 2, description: "Host ceremonies and sessions" },
            { role: "Photography", count: 4, description: "Event documentation" },
            { role: "Videography", count: 3, description: "Record talks and highlights" },
          ]),
          perks: "Certificate, ₹2000 stipend, meals, festival kit, networking",
          eligibility: "College students preferred. Must commit to all 3 days.",
          contactEmail: "techfest@techcorp.in",
        },
      ];

      for (const eventData of sampleEvents) {
        const exists = await db.event.findFirst({
          where: { title: eventData.title, organizerId: orgUser.id },
        });
        if (!exists) {
          await db.event.create({
            data: {
              organizerId: orgUser.id,
              ...eventData,
            },
          });
        }
      }
    }

    return NextResponse.json({
      message: "Database seeded successfully",
      accounts: {
        admin: "admin@gigbharat.in / admin123",
        volunteer: "volunteer@demo.com / volunteer123",
        organization: "org@demo.com / org123",
        college: "college@demo.com / college123",
      },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Seeding failed" }, { status: 500 });
  }
}
