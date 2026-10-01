import { useState } from 'react'
import { menu, money } from '../data/catalog'
import { PageIntro, Image, Filters } from '../components/UI'

export default function Menu() {
  const [category, setCategory] = useState('All')
  const items = menu.filter(item => category === 'All' || item.category === category)
  return (
    <>
      <PageIntro eyebrow="BREWED WITH CARE · MADE TO BE SAVORED" title="Something for your slow day.">
        Your favorite ritual, or a lovely new discovery.
      </PageIntro>
      <section className="section catalog menu-catalog">
        <Filters label="Menu category" values={['All', 'Coffee', 'Non-Coffee', 'Tea', 'Desserts', 'Light Bites']} value={category} onChange={setCategory} />
        <p className="results-caption" role="status">{category === 'All' ? 'The full menu' : category} · {items.length} lovely choices</p>
        <div className="grid three">
          {items.map(item => (
            <article className="product-card" key={item.name}>
              <div className="card-photo">
                <Image src={item.image} alt={item.name} />
                {item.tag && <span className="badge">{item.tag}</span>}
              </div>
              <p className="eyebrow">{item.category}</p>
              <div className="card-title"><h2>{item.name}</h2><span>{money(item.price)}</span></div>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
        <p className="catalog-note">Made fresh, enjoyed slowly. Ask us about milk alternatives and dietary needs.<br />Illustrative menu · Sample prices in Sri Lankan Rupees (LKR).</p>
      </section>
    </>
  )
}
