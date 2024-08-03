document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const cardId = urlParams.get('id');
  
    const cardData = {
      1: {
        img: 'img1.jpg',
        title: 'Card 1',
        tags: 'Tag1, Tag2',
        description: 'This is a longer description for card 1.'
      },
      2: {
        img: 'img2.jpg',
        title: 'Card 2',
        tags: 'Tag3, Tag4',
        description: 'This is a longer description for card 2.'
      },
      3: {
        img: 'img3.jpg',
        title: 'Card 3',
        tags: 'Tag5, Tag6',
        description: 'This is a longer description for card 3.'
      },
      4: {
        img: 'img4.jpg',
        title: 'Card 4',
        tags: 'Tag7, Tag8',
        description: 'This is a longer description for card 4.'
      },
      5: {
        img: 'img5.jpg',
        title: 'Card 5',
        tags: 'Tag9, Tag10',
        description: 'This is a longer description for card 5.'
      },
      6: {
        img: 'img6.jpg',
        title: 'Card 6',
        tags: 'Tag11, Tag12',
        description: 'This is a longer description for card 6.'
      }
    };
  
    const data = cardData[cardId];
  
    if (data) {
      document.getElementById('detail-img').src = data.img;
      document.getElementById('detail-title').textContent = data.title;
      document.getElementById('detail-tags').textContent = data.tags;
      document.getElementById('detail-description').textContent = data.description;
    } else {
      document.getElementById('detail-title').textContent = 'Card not found';
    }
  
    document.getElementById('back-btn').addEventListener('click', () => {
      window.history.back();
    });
  });
  