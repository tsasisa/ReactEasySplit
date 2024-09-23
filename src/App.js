import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Rowley",
    image: require("./assets/boy1.jpg"),
    balance: -7,
  },
  {
    id: 933372,
    name: "Jhon",
    image: require("./assets/boy2.webp"),
    balance: 20,
  },
  {
    id: 499476,
    name: "Niki",
    image: require("./assets/girl1.jpg"),
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return <button className="button" onClick={onClick}>{children}</button>
}

export default function App() {
  // since this is a demo, this is a set of default friends
  const [friends, setFriends] = useState(initialFriends);
  // very important, dont forget to import useState from react
  const [showAddFriend, setShowAddFriend] = useState(false);

  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  // make the form able to add new friends
  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);

    // after form is filled and submited, hide form
    setShowAddFriend(false);
  }

  // set selected friend's attributes (name, balance, etc) to be chosen
  function handleSelection(friend) {
    //setSelectedFriend(friend);
    setSelectedFriend((cur) => cur?.id === friend.id ? null : friend);
    //  when split bill form is opened, add friend form is closed
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    setFriends(friends => friends.map(friend => friend.id === selectedFriend.id ? { ...friend, balance: friend.balance + value } : friend));
    setSelectedFriend(null);
  }

  return (
    <div>
      <nav className="navbar">
        <div className="logo">EasySplit.</div>
      </nav>
      <div className="app">
        <div className="sidebar">
          <FriendsList
            friends={friends}
            selectedFriend={selectedFriend}
            onSelection={handleSelection} />
          {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
          <Button onClick={handleShowAddFriend}>{showAddFriend ? "Close" : "Add Friend"}</Button>
        </div>

        {selectedFriend && <FormSplitBill selectedFriend={selectedFriend} onSplitBill={handleSplitBill} />}
      </div>
    </div>
  );
}


function FriendsList({ friends, onSelection, selectedFriend }) {

  // make list of friends name from the array we made
  return (<ul>
    {friends.map((friend) => (<Friend friend={friend}
      key={friend.id}
      selectedFriend={selectedFriend}
      onSelection={onSelection} />))}
  </ul>
  );

}

// get data of friend's name
// if balance is negative, we owe to friend
// if positive friend owes us, if ===0 done
function Friend({ friend, onSelection, selectedFriend }) {

  const isSelected = selectedFriend?.id === friend.id;

  return <li className={isSelected ? "selected" : ""}>
    <img src={friend.image} alt={friend.name} />
    <h3>{friend.name}</h3>

    {friend.balance < 0 && (
      <p className="red">You owe {friend.name} ${Math.abs(friend.balance)}</p>
    )}

    {friend.balance > 0 && (
      <p className="green">Your friend {friend.name} owes you ${Math.abs(friend.balance)}</p>
    )}

    {friend.balance === 0 && (
      <p>You and {friend.name} are even!</p>
    )}

    <Button onClick={() => onSelection(friend)}>{isSelected ? "Close" : "Select"}</Button>
  </li>;
}

// parameter is passing an object, so use{}
function FormAddFriend({ onAddFriend }) {

  // to add new friends
  const [name, setName] = useState("");
  // automatically adds image from this website
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    // prevent reload the entire page (always need this when submit)
    e.preventDefault();

    if (!name || !image) return;

    // make random id on browser
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      // adding the id will lead to the image generated being the same
      image: `${image}?=${id}`,
      balance: 0,

    };

    onAddFriend(newFriend);

    setName("")
    setImage("https://i.pravatar.cc/48")
  }

  return <form className="form-add-friend" onSubmit={handleSubmit}>
    <label>Friend Name</label>
    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

    <label>Image URL</label>
    <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />

    <Button>Add</Button>
  </form>
}

function FormSplitBill({ selectedFriend, onSplitBill }) {

  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState('');
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoPays, setWhoPays] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByUser) return;
    // so if user pays, means positive for user but if friend pays, user will owe friend so negative
    onSplitBill(whoPays === 'user' ? paidByFriend : -paidByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>Bill Value</label>
      <input type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>Your Expense</label>
      <input type="text"
        value={paidByUser}
        onChange={(e) => setPaidByUser(Number(e.target.value) > bill ? paidByUser : Number(e.target.value))}
      />

      <label>{selectedFriend.name}'s expense</label>
      <input type="text" disabled value={paidByFriend} />

      <label>Who is paying the bill?</label>
      <select
        value={whoPays}
        onChange={(e) => setWhoPays(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}
