import Link from 'next/link';

export default function Pricing() {
  return (
    <section className="pricing">
      <div className="max">
        <h2 className="pricing-h2 fu">Plans for every team size</h2>
        <div className="pricing-grid">
          <div className="price-card fu d1">
            <div className="price-name">Basic</div>
            <div className="price-val"></div>
            <p className="price-p">Everything you need to get started with basic scheduling.</p>
            <Link href="/register" className="btn-price-s">Get Started</Link>
          </div>
          <div className="price-card popular fu d2">
            <div className="popular-tag">Most Popular</div>
            <div className="price-name">Professional</div>
            <div className="price-val"><span>/mo</span></div>
            <p className="price-p">The most flexible way for individuals to schedule meetings.</p>
            <Link href="/register" className="btn-price-p">Try for free</Link>
          </div>
          <div className="price-card fu d3">
            <div className="price-name">Teams</div>
            <div className="price-val"><span>/mo</span></div>
            <p className="price-p">Everything in Pro plus features for collaboration & reporting.</p>
            <Link href="/register" className="btn-price-s">Try for free</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
