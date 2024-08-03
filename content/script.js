document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
  
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
  
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const cardId = card.dataset.id;
        window.location.href = `details.html?id=${cardId}`;
      });
    });
  });
  