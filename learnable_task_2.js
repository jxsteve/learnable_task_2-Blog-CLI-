// Import readline for user input and fs for file read/write
import readline from "readline";
import fs from "fs";

// The file where posts are stored
const dataFile = "posts.json";

// Read all posts from the file
const getPosts = () => {
    try {
        if (fs.existsSync(dataFile)) {
            const data = fs.readFileSync(dataFile, "utf-8");
            return JSON.parse(data || "[]");
        }
    } catch (error) {
        console.error("Error reading posts:", error);
    }
    return [];
};

// Save all posts to the file
const savePosts = (posts) => {
    fs.writeFileSync(dataFile, JSON.stringify(posts, null, 2), "utf-8");
};

// Load existing posts when the app starts
let posts = getPosts();

// Set up input/output for the terminal
const input = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Handle the user's menu choice
const handleChoice = (choice) => {
    switch (choice) {
        case "1":
            createPost();
            break;
        case "2":
            viewPosts();
            break;
        case "3":
            editPost();
            break;
        case "4":
            deletePost();
            break;
        case "5":
            console.log("Goodbye!");
            input.close();
            break;
        default:
            console.log("Invalid choice. Pick a number between 1-5.");
            showMenu();
    }
};

// Show the main menu
const showMenu = () => {
    console.log(`
========================================
       Journal Management System
========================================
  1. Write a new post
  2. Read all posts
  3. Update a post
  4. Delete a post
  5. Exit
========================================
    `);
    input.question("Select an option (1-5): ", (choice) => {
        handleChoice(choice);
    });
};

// Create a new post
const createPost = () => {
    input.question("Enter title: ", (title) => {
        input.question("Enter content: ", (content) => {
            const date = new Date().toLocaleString();
            posts.push({ title, content, date });
            savePosts(posts);
            console.log("Post saved!");
            showMenu();
        });
    });
};

// View all posts
const viewPosts = () => {
    posts = getPosts();
    console.log("\n--- My Posts ---");
    if (posts.length === 0) {
        console.log("\nNo posts yet. Create one first!");
    } else {
        posts.forEach(({ title, content, date }, index) => {
            console.log(`\nPost #${index + 1}:`);
            console.log(`  Title:   ${title}`);
            console.log(`  Content: ${content}`);
            console.log(`  Date:    ${date}`);
        });
    }
    showMenu();
};

// Edit an existing post
const editPost = () => {
    if (posts.length === 0) {
        console.log("\nNo posts to edit.");
        return showMenu();
    }

    input.question("Enter post number to edit: ", (number) => {
        // Convert string to number and adjust for zero-based index
        const index = parseInt(number, 10) - 1;

        if (isNaN(index)) {
            console.log("\nNot a valid number. Try again.");
            return editPost();
        }

        if (index >= 0 && index < posts.length) {
            const post = posts[index];
            console.log(`\nEditing Post #${index + 1}:`);
            console.log(`  Title:   ${post.title}`);
            console.log(`  Content: ${post.content}`);

            input.question("New title (Enter to skip): ", (newTitle) => {
                input.question("New content (Enter to skip): ", (newContent) => {
                    posts[index] = {
                        ...post,
                        title: newTitle || post.title,
                        content: newContent || post.content,
                    };
                    savePosts(posts);
                    console.log("Post updated!");
                    showMenu();
                });
            });
        } else {
            console.log("\nPost not found.");
            showMenu();
        }
    });
};

// Delete a post
const deletePost = () => {
    if (posts.length === 0) {
        console.log("\nNo posts to delete.");
        return showMenu();
    }

    input.question("Enter post number to delete: ", (number) => {
        const index = parseInt(number, 10) - 1;

        if (isNaN(index)) {
            console.log("\nNot a valid number. Try again.");
            return deletePost();
        }
        if (index >= 0 && index < posts.length) {
            posts.splice(index, 1);
            savePosts(posts);
            console.log("Post deleted!");
        } else {
            console.log("\nPost not found.");
        }
        showMenu();
    });
};

// Start the app
showMenu();