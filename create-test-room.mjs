import axios from 'axios';

async function createTestRoom() {
    try {
        const response = await axios.post('http://localhost:3001/room', {
            username: 'TestPlayer',
            avatarId: 1
        });

        console.log('✅ Room created successfully!');
        console.log('Room Slug:', response.data.slug);
        console.log('Room ID:', response.data.roomId);
        console.log('Token:', response.data.token);
        console.log('\n🔗 Visit: http://localhost:3000/room/' + response.data.slug);
    } catch (error) {
        console.error('❌ Failed to create room:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
}

createTestRoom();
