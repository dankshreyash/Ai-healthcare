"""
Seed script – populates the SQLite database with realistic dummy data.
Run with:  python -m app.database.seed
"""

from datetime import date, datetime, timedelta, timezone
from app.database.database import engine, Base
from app.database.session import SessionLocal
from app.models.interaction import Interaction


DUMMY_INTERACTIONS = [
    {
        "doctor_name": "Dr. Rajesh Sharma",
        "hospital": "Apollo Hospital, Delhi",
        "specialty": "Endocrinology",
        "interaction_type": "In-Person",
        "interaction_date": date(2026, 7, 10),
        "discussion_notes": "Discussed the efficacy of Metformin XR in Type 2 diabetes management. Dr. Sharma showed interest in the latest Phase III trial results.",
        "products_discussed": "Metformin XR, Insulin Glargine",
        "summary": "Productive meeting with Dr. Sharma. He is open to prescribing Metformin XR for newly diagnosed patients. Requested clinical trial data.",
        "follow_up_date": date(2026, 7, 17),
        "follow_up_action": "Send Phase III clinical trial report and schedule a lunch meeting.",
    },
    {
        "doctor_name": "Dr. Priya Patel",
        "hospital": "Fortis Hospital, Mumbai",
        "specialty": "Cardiology",
        "interaction_type": "Virtual",
        "interaction_date": date(2026, 7, 8),
        "discussion_notes": "Presented the cardiovascular benefits of our new statin formulation. Dr. Patel had questions about drug interactions with anticoagulants.",
        "products_discussed": "Atorvastatin Plus, Clopidogrel",
        "summary": "Dr. Patel is cautiously optimistic about Atorvastatin Plus. Needs more data on drug interaction profiles before prescribing.",
        "follow_up_date": date(2026, 7, 22),
        "follow_up_action": "Share drug interaction study results and arrange a KOL webinar invitation.",
    },
    {
        "doctor_name": "Dr. Amit Kumar",
        "hospital": "AIIMS, New Delhi",
        "specialty": "Oncology",
        "interaction_type": "Conference",
        "interaction_date": date(2026, 7, 5),
        "discussion_notes": "Met at the National Oncology Summit. Discussed our immunotherapy pipeline and upcoming biologics launch.",
        "products_discussed": "Pembrolizumab Biosimilar, Trastuzumab",
        "summary": "Dr. Kumar is a key opinion leader in oncology. Expressed strong interest in our biosimilar program and wants early access to clinical data.",
        "follow_up_date": date(2026, 7, 20),
        "follow_up_action": "Send biosimilar efficacy comparison report and invite to advisory board.",
    },
    {
        "doctor_name": "Dr. Sunita Reddy",
        "hospital": "Manipal Hospital, Bangalore",
        "specialty": "Neurology",
        "interaction_type": "In-Person",
        "interaction_date": date(2026, 7, 3),
        "discussion_notes": "Discussed our new migraine prophylaxis medication. Dr. Reddy has been using competitor products and is looking for alternatives with fewer side effects.",
        "products_discussed": "Erenumab, Topiramate ER",
        "summary": "Dr. Reddy agreed to trial Erenumab for 5 patients with chronic migraine. Will evaluate outcomes over 3 months.",
        "follow_up_date": date(2026, 8, 3),
        "follow_up_action": "Provide patient starter kits and check in after first month of trial.",
    },
    {
        "doctor_name": "Dr. Vikram Singh",
        "hospital": "Max Healthcare, Gurugram",
        "specialty": "Pulmonology",
        "interaction_type": "Phone Call",
        "interaction_date": date(2026, 7, 11),
        "discussion_notes": "Quick call to follow up on the inhaler samples sent last week. Dr. Singh reported positive patient feedback on the new dry-powder formulation.",
        "products_discussed": "Budesonide-Formoterol DPI, Tiotropium",
        "summary": "Positive reception for our DPI inhaler. Dr. Singh will increase prescriptions if supply chain remains stable.",
        "follow_up_date": date(2026, 7, 18),
        "follow_up_action": "Confirm supply availability and send updated pricing list.",
    },
    {
        "doctor_name": "Dr. Meena Iyer",
        "hospital": "Narayana Health, Chennai",
        "specialty": "Dermatology",
        "interaction_type": "Email",
        "interaction_date": date(2026, 7, 9),
        "discussion_notes": "Email exchange regarding our new biologic for psoriasis. Dr. Iyer requested detailed prescribing information and patient assistance program details.",
        "products_discussed": "Secukinumab, Adalimumab Biosimilar",
        "summary": "Dr. Iyer is evaluating our biologic for moderate-to-severe psoriasis patients who have failed conventional therapy.",
        "follow_up_date": date(2026, 7, 16),
        "follow_up_action": "Send prescribing information PDF, patient assistance forms, and schedule a virtual product demo.",
    },
    {
        "doctor_name": "Dr. Arjun Mehta",
        "hospital": "Medanta Hospital, Delhi",
        "specialty": "Gastroenterology",
        "interaction_type": "In-Person",
        "interaction_date": date(2026, 7, 12),
        "discussion_notes": "Detailed discussion on our PPI formulation with extended release mechanism. Dr. Mehta compared it with existing options in the market.",
        "products_discussed": "Pantoprazole DR, Esomeprazole",
        "summary": "Dr. Mehta sees potential in our extended-release PPI for GERD patients requiring 24-hour coverage. Wants head-to-head comparison data.",
        "follow_up_date": date(2026, 7, 25),
        "follow_up_action": "Provide comparative efficacy study and arrange a hospital pharmacy meeting.",
    },
    {
        "doctor_name": "Dr. Kavita Joshi",
        "hospital": "Kokilaben Hospital, Mumbai",
        "specialty": "Pediatrics",
        "interaction_type": "Virtual",
        "interaction_date": date(2026, 7, 7),
        "discussion_notes": "Discussed pediatric formulations of common antibiotics. Dr. Joshi emphasized the importance of palatable suspensions for compliance.",
        "products_discussed": "Amoxicillin Suspension, Azithromycin Pediatric",
        "summary": "Dr. Joshi willing to switch to our strawberry-flavored amoxicillin suspension if taste-test data supports better compliance.",
        "follow_up_date": date(2026, 7, 21),
        "follow_up_action": "Send taste acceptability study results and sample bottles for clinic trial.",
    },
]


def seed_database():
    """Create tables and insert dummy data."""
    # Create all tables
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Check if data already exists
        existing = db.query(Interaction).count()
        if existing > 0:
            print(f"Database already has {existing} interactions. Skipping seed.")
            return

        now = datetime.now(timezone.utc)
        for data in DUMMY_INTERACTIONS:
            interaction = Interaction(
                **data,
                created_at=now,
                updated_at=now,
            )
            db.add(interaction)

        db.commit()
        print(f"[OK] Seeded {len(DUMMY_INTERACTIONS)} dummy interactions successfully!")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Error seeding database: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
