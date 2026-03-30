'use client';

import React, { useState, useEffect } from 'react';
import styles from './HeroSection.module.css';

const Card1 = () => (
  <div className={styles.slide}>
    <div className={styles.mockupUI}>
      <div className={styles.mockupSidebar}>
        <div className={styles.avatar}>FS</div>
        <div className={styles.hostInfo}>
          <b>FATIMA SY</b>
          <span>Client Check-in</span>
        </div>
        <div className={styles.metaRow}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          30 min
        </div>
        <div className={styles.metaRow}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
          Zoom
        </div>
      </div>
      <div className={styles.mockupMain}>
        <div className={styles.calendar}>
          <div className={styles.monthNav}>‹ July 2024 ›</div>
          <div className={styles.calendarGrid}>
            {['S','M','T','W','Th','F','Sa'].map(d => <div key={d} className={styles.day}>{d}</div>)}
            {[...Array(30)].map((_, i) => (
              <div key={i} className={`${styles.day} ${[10,12,18,22,25].includes(i+1) ? styles.dayActive : ''} ${i+1 === 22 ? styles.daySelected : ''}`}>
                {i + 1}
              </div>
            ))}
          </div>
          <div className={styles.timeSlots}>
            <div className={styles.slot}>10:00am</div>
            <div className={`${styles.slot} ${styles.slotSelected}`}>11:00am</div>
            <div className={`${styles.slot} ${styles.slotConfirm}`}>Confirm</div>
            <div className={styles.slot}>1:00pm</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Card2 = () => (
  <div className={styles.slide}>
    <div className={styles.automationGrid}>
      <div className={styles.workflowCard}>
        <span className={styles.wfBadge}>WORKFLOW</span>
        <div className={styles.wfTitle}>Send text reminder</div>
        <div className={styles.stepBox}>24 hours before event starts</div>
        <div className={styles.connector}>
          {[1,2,3,4].map(i => <div key={i} className={styles.dotLine} />)}
        </div>
        <div className={styles.actionBox}>
          <div className={styles.iconSq} />
          Text invitee
        </div>
      </div>
      <div className={styles.workflowCard}>
        <span className={styles.wfBadge}>WORKFLOW</span>
        <div className={styles.wfTitle}>Send follow-up email</div>
        <div className={styles.stepBox}>2 hours after event ends</div>
        <div className={styles.connector}>
          {[1,2,3,4].map(i => <div key={i} className={styles.dotLine} />)}
        </div>
        <div className={styles.actionBox}>
          <div className={styles.iconSq} style={{background: '#0b3558'}} />
          Email invitee
        </div>
      </div>
    </div>
  </div>
);

export default function HeroSection() {
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCard(prev => (prev === 0 ? 1 : 0));
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className={styles.heroSection}>
      <div className={styles.blobs}>
        <div className={styles.blob1} />
        <div className={styles.blob2} />
      </div>

      <div className={styles.leftCol}>
        <div className={styles.badge} style={{animationDelay: '0.1s'}}>
          <div className={styles.dot} />
          Trusted by 20M+ professionals
        </div>
        
        <h1 className={styles.title} style={{animationDelay: '0.2s'}}>
          Easy scheduling <br />
          <span className={styles.blueText}>ahead</span>
        </h1>
        
        <p className={styles.description} style={{animationDelay: '0.3s'}}>
          Join 20 million professionals who easily book meetings with the #1 scheduling tool.
        </p>
        
        <div className={styles.socialBtns} style={{animationDelay: '0.4s'}}>
          <button className={styles.btnSocial}>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="20" alt="" />
            Google
          </button>
          <button className={styles.btnSocial}>
            <svg width="20" height="20" viewBox="0 0 23 23"><path fill="#f35325" d="M1 1h10v10H1z"/><path fill="#81bc06" d="M12 1h10v10H12z"/><path fill="#05a6f0" d="M1 12h10v10H1z"/><path fill="#ffba08" d="M12 12h10v10H12z"/></svg>
            Microsoft
          </button>
        </div>

        <div className={styles.divider} style={{animationDelay: '0.45s'}}>
          <div className={styles.line} />
          <span className={styles.orText}>or</span>
          <div className={styles.line} />
        </div>

        <div className={styles.emailLinkContainer} style={{animationDelay: '0.5s'}}>
          <a href="#" className={styles.emailLink}>Sign up free with email.</a>
          <span className={styles.noCard}>No credit card required</span>
        </div>

        <div className={styles.statsRow} style={{animationDelay: '0.6s'}}>
          <div className={styles.statItem}>
            <b>20M+</b>
            <span>Users worldwide</span>
          </div>
          <div className={styles.statItem}>
            <b>100+</b>
            <span>App integrations</span>
          </div>
          <div className={styles.statItem}>
            <b>4.7★</b>
            <span>Average rating</span>
          </div>
        </div>
      </div>

      <div className={styles.rightCol}>
        <div className={styles.cardContainer}>
          <div className={styles.cardHeader}>
            <span className={styles.tagPill}>
              {activeCard === 0 ? '📅 Booking' : '⚡ Automation'}
            </span>
            <div className={styles.cardTitle}>
              {activeCard === 0 ? 'Share your booking page' : 'Reduce no-shows'}
            </div>
            <div className={styles.cardDesc}>
              {activeCard === 0 
                ? 'Share your scheduling link directly with invitees.' 
                : 'Automate reminders and follow-up emails.'}
            </div>
          </div>
          <div className={styles.cardBody}>
            {activeCard === 0 ? <Card1 /> : <Card2 />}
          </div>
        </div>
        <div className={styles.indicators}>
          <div className={`${styles.dotInd} ${activeCard === 0 ? styles.dotActive : ''}`} />
          <div className={`${styles.dotInd} ${activeCard === 1 ? styles.dotActive : ''}`} />
        </div>
      </div>
    </section>
  );
}
