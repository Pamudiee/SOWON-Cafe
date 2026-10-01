import { useState } from 'react'
import { gifts, money } from '../data/catalog'
import { PageIntro, Image, Filters } from '../components/UI'
import GiftCustomizer from '../components/GiftCustomizer'

export default function Gifts() {
  const [category, setCategory] = useState('All')
  const [selected, setSelected] = useState(null)
  const items = gifts.filter(item => category === 'All' || item.category === category)
  return (
    <>
      <PageIntro eyebrow="SMALL THINGS · BIG FEELINGS" title="A little more personal.">
        Choose a gift, add a personal touch, and make their everyday a little lovelier.
      </PageIntro>
      <section className="section catalog gifts-catalog">
        <p className="catalog-guide">01 Choose your gift <span aria-hidden="true">/</span> 02 Make it personal <span aria-hidden="true">/</span> 03 Preview your creation</p>
        <Filters label="Gift category" values={['All', ...gifts.map(item => item.category)]} value={category} onChange={setCategory} />
        <p className="results-caption" role="status">{category === 'All' ? 'The gift collection' : category} · {items.length} {items.length === 1 ? 'thoughtful gift' : 'thoughtful gifts'}</p>
        <div className="grid three">
          {items.map(item => (
            <article className="product-card" key={item.name}>
              <div className="card-photo"><Image src={item.image} alt={item.name} /><span className="badge">Make it personal</span></div>
              <p className="eyebrow">{item.category}</p>
              <h2>{item.name}</h2>
              <p>{item.description}</p>
              <div className="card-bottom">
                <span>From {money(item.price)}</span>
                <button className="text-link" aria-label={`Customize ${item.name}`} onClick={() => setSelected(item)}>Customize <span aria-hidden="true">↗</span></button>
              </div>
            </article>
          ))}
        </div>
        <p className="catalog-note">Thoughtful gifting from Rajagiriya, Sri Lanka. All prices in Sri Lankan Rupees; designs and prices are illustrative.</p>
      </section>
      {selected && <GiftCustomizer key={selected.name} item={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
