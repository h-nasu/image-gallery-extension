
export default {
  dbname: 'chrome-image-extension-db',
  dbversion: '1',
  schema: {
    images: {
      indexes: [
        {
          name: 'collectionIds',
          options: {
            unique: false
          }
        }
      ],
      defaultData: [
        {
          id: 1,
          url: 'http://cdn.shopify.com/s/files/1/0085/9268/7184/products/Lambda-Bikini-2019-Women-Swimwear-Swimsuit-Two-Pieces-Sexy-Girl-Summer-Beachwear-Bathing-Suit-biquinis-feminino_1200x1200.jpg?v=1557175483'
        },
        {
          id: 2,
          url: 'https://t1.pixers.pics/img-c676e9e9/posters-young-sexy-girl-in-lingerie-stand-in-front-door.jpg?H4sIAAAAAAAAA42PW07EMAxFt9OR2rHzcJp0AfM7S6iaJh0KfSkpULF6XED8ISF_-HmPdeF1yd0QoY_LHhPMYwhThGGcuMtNinn8iAWWZPDS8HQqELla32Lq07oVldCyrIgPhC2N4NV7x8q5Sy_F075vuQHI6rqNB-M49Rn6OYNEUQNaIGedxVqLzmhqtyrv3RK6FCqFh6brtjxKPOP_WAsCgXwQ3ngbUHvbSokHYfVL-MJKV7MpcaJ_TNaIZX2a29M4F-x25eu9eN4eF_jj53cNrILbHZQDIlAGtDxH7e2uHJEyWrZKWtRiUH5AFwYnrEHUxlL0Hh0N-spfPgHd_fxOigEAAA=='
        },
        {
          id: 3,
          url: 'https://i.pinimg.com/originals/f0/7c/0d/f07c0d58994bcfc0340f7a771951e68b.jpg'
        },
        {
          id: 4,
          url: 'https://c4.wallpaperflare.com/wallpaper/130/993/106/arina-bezlapova-women-blonde-women-outdoors-wallpaper-preview.jpg'
        },
        {
          id: 5,
          url: 'https://d1w8cc2yygc27j.cloudfront.net/4047559315717139427/-2070753470022988852.jpg'
        }
      ]
    },
    collections: {
      indexes: [],
      defaultData: [
        {
          id: 1,
          name: 'All Images'
        }
      ]
    }
  },
}
