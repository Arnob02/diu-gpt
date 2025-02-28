const Bubble = ({ message }) => {
    const { content, role } = message;

    return (
        <div className={`${role} bubble`}>
            {content} {/* Ensure message content is displayed */}
        </div>
    );
}; 

export default Bubble;
