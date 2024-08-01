


const getUserInfo = async(request, response) => {
    try {
        // Assign user object from request to user variable
        const user = request.user;

        if (!user) {
            console.log('User not found');
            return response.status(404).json({ msg: 'User not found' });
        }

        response.json(user);
    } catch (error) {
        // Log caught error to server console and return server error to client
        console.error('Error:', error.message);
        response.status(500).send(`Server error`);
    }
};

module.exports = {
    getUserInfo,
}