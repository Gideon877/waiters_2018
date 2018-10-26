const FriendStatuses = {
    Pending: 'PENDING',
    Connected: 'CONNECTED',
    Rejected: 'REJECTED',
    Deleted: 'DELETED',
    Follow: 'FOLLOW',
    NotFollowing: 'NOT_FOLLOWING'
}

const ImagePath = {
    Other: ['mark.png', 'kristy.png','amanda.jpg', 'viwe.jpg','john.jpg', 'rachel.png', 'chris.jpg', 'eve.png', 'patrick.png', 'stevie.jpg', 'steve.jpg', 'tom.jpg'],
    Male: ['mark.png', 'john.jpg', 'chris.jpg', 'patrick.png', 'steve.jpg', 'tom.jpg'],
    Female: ['kristy.png','amanda.jpg', 'viwe.jpg', 'rachel.png', 'eve.png', 'stevie.jpg']
}

const BCryptRounds = 15;

module.exports = {
    FriendStatuses,
    ImagePath,
    BCryptRounds
}