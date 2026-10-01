export const photo = (id, width = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`
export const images = {
 cafe: photo('photo-1442512595331-e89e73853f31', 2000), interior: photo('photo-1554118811-1e0d58224f24'), coffee: photo('photo-1461023058943-07fcbe16d735'), matcha: photo('photo-1515823064-d6e0c04616a7'), cake: photo('photo-1464305795204-6f5bbfc7fb81'), pottery: photo('photo-1565193298357-c5b55ae148a7'), flowers: photo('photo-1490750967868-88aa4486c946'), journal: photo('photo-1455390582262-044cdead277a'), candle: photo('photo-1603006905003-be475563bc59'), painting: photo('photo-1513364776144-60967b0f800f'), music: photo('photo-1510915361894-db8b60106cb1'), gifts: photo('photo-1549465220-1a8b9238cd48'), mug: photo('photo-1514228742587-6b1558fcca3d'), chocolate: photo('photo-1511381939415-e44015466834'), plush: photo('photo-1559454403-b8fb88521f11'),
}
export const menu = [
 { name: 'Cloud Cream Latte', category: 'Coffee', price: 950, description: 'Velvety espresso, soft milk, and our signature cream cloud.', image: images.coffee, tag: 'SOWON pick' },
 { name: 'Strawberry Matcha', category: 'Non-Coffee', price: 1250, description: 'Earthy matcha meets strawberry purée and a little sweetness.', image: images.matcha, tag: 'A little favorite' },
 { name: 'Strawberry Cream Cake', category: 'Desserts', price: 1100, description: 'Light sponge, fresh strawberries, and clouds of cream.', image: images.cake, tag: 'Made with care' },
 { name: 'Brown Sugar Latte', category: 'Coffee', price: 1050, description: 'Deep espresso, brown sugar, and oat milk.', image: images.coffee },
 { name: 'Yuja Honey Tea', category: 'Tea', price: 850, description: 'Fragrant Korean citron with honey. A cup of sunshine.', image: images.matcha },
 { name: 'Black Sesame Milk', category: 'Non-Coffee', price: 1000, description: 'Roasted black sesame with a gently nutty finish.', image: images.coffee },
 { name: 'Garden Toast', category: 'Light Bites', price: 1650, description: 'Sourdough, whipped ricotta, seasonal greens, and sesame.', image: photo('photo-1541519227354-08fa5d50c44d') },
 { name: 'Basque Cheesecake', category: 'Desserts', price: 1250, description: 'A caramelized top with a wonderfully creamy center.', image: images.cake },
]
export const workshops = [
 { name: 'A Little Clay Therapy', type: 'Pottery', image: images.pottery, description: 'Slow down and shape something beautifully imperfect.', make: 'Hand-build a small bowl or trinket dish. Glazing and firing are included; collect your piece in three weeks.', day: 'Monday', time: '14:00', weekendDay: 'Saturday', weekendTime: '10:00', duration: '2 hours', price: 6500, spots: 6 },
 { name: 'Paint Your Own Moment', type: 'Painting', image: images.painting, description: 'A blank canvas, a warm drink, and room to explore.', make: 'Paint a small acrylic canvas inspired by everyday moments, with gentle guidance from our host.', day: 'Tuesday', time: '15:00', weekendDay: 'Saturday', weekendTime: '13:00', duration: '2 hours', price: 4500, spots: 8 },
 { name: 'Scents & Slow Living', type: 'Candle Making', image: images.candle, description: 'Blend a comforting scent that feels like you.', make: 'Blend fragrance oils and pour your own soy wax candle in a reusable vessel.', day: 'Wednesday', time: '14:00', weekendDay: 'Sunday', weekendTime: '10:00', duration: '90 minutes', price: 5500, spots: 5 },
 { name: 'Pages for Yourself', type: 'Journaling', image: images.journal, description: 'Make space for your thoughts, one page at a time.', make: 'Create a journal spread using prompts, collage papers, stamps, and washi tape.', day: 'Thursday', time: '16:00', weekendDay: 'Saturday', weekendTime: '16:00', duration: '90 minutes', price: 3500, spots: 10 },
 { name: 'Flowers for the Everyday', type: 'Flower Arranging', image: images.flowers, description: 'Find your rhythm among seasonal stems.', make: 'Arrange and wrap a seasonal hand-tied bouquet to take home or give to someone you love.', day: 'Friday', time: '14:00', weekendDay: 'Sunday', weekendTime: '13:00', duration: '90 minutes', price: 6000, spots: 6 },
 { name: 'Sunday Kind of Sound', type: 'Music Sessions', image: images.music, description: 'An easygoing acoustic circle for listening and connecting.', make: 'Explore simple rhythms and shared songs with our acoustic host. Listening is participation, too.', day: 'Friday', time: '17:00', weekendDay: 'Sunday', weekendTime: '16:00', duration: '1 hour', price: 2500, spots: 12 },
]
export const gifts = [
 { name: 'The Slow Morning Set', category: 'Coffee Sets', price: 4800, image: images.coffee, description: 'A little ritual of specialty coffee and quiet mornings.' },
 { name: 'Your Everyday Mug', category: 'Mugs', price: 2800, image: images.mug, description: 'A favorite cup, with a name that makes it yours.' },
 { name: 'A Box of Little Joys', category: 'Gift Boxes', price: 6500, image: images.gifts, description: 'Thoughtful little things, beautifully brought together.' },
 { name: 'Words from the Heart', category: 'Cards', price: 650, image: images.journal, description: 'A keepsake card for the words that matter.' },
 { name: 'Pocketful of Wishes', category: 'Mini Keepsakes', price: 1500, image: images.pottery, description: 'A tiny clay charm with a personal touch.' },
 { name: 'Your Cuddle Companion', category: 'Customized Plushies', price: 4500, image: images.plush, description: 'A soft friend with a name and a note from you.' },
 { name: 'Everlasting Little Blooms', category: 'Handmade Flowers', price: 3800, image: images.flowers, description: 'A handmade bouquet for moments worth keeping.' },
 { name: 'Something Sweet', category: 'Chocolates', price: 2400, image: images.chocolate, description: 'A small assortment of chocolate, wrapped with love.' },
]
const rupees = new Intl.NumberFormat('en-LK', { maximumFractionDigits: 0 })
export const money = value => 'Rs. ' + rupees.format(value)
