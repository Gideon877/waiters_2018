# Waiter's Web Application

## User/Waiter

#### User
_**user can:**_
- update waiter's shift
- add new friends
- delete and view friend's profile

#### Friends
_**you can view**_
- profile or details of a friend
- see friends feeds
#### Messages
- read, write, delete and send messages
#### Admin   
- do everything any `user` can perform

---

TYPE | ROUTE        | DESCRIPTION
:----: | :---:  | :----------------------: 
GET  | `api/register` | registration screen form
POST | `api/register` | Create a new **user**
GET  | `api/login` | Login screen form
POST | `api/login` | Log any registered **user** in.
GET  | `api/waiter/:id` | Home screen
POST | `api/waiter/:id` | update **waiter's** selected days.
GET  | `api/admin` | **admin** home screen
GET  | `api/waiter/:id/friends` | **waiter's friends** home screen 
DELETE  | `api/waiter/:id/friends/:friendId` | delete **user's friend** 
GET  | `api/waiter/:id/friends/:friendId` | view **user's friend** details 
POST | `api/waiter/:id/friends/:friendId` | update **user's friend** connection status 
PUT  | `api/waiter/:id/friends/:friendId` | add **user's friend** 
 
---

#### User
* Register new account
    * You need:
        * `username`, `firstname` and `lastname`, secret `password`, `gender`.
* Login using username and password
* View available days
* Select days to work (Update schedule)

#### Friends

* Add or Follow
* Delete
* View more details

#### Messages

*  Read Messages
*  Delete Messages
*  Send Messages

#### Admin
* Login using `username`: `admin` and password
* View Waiter's days
* Clear schedule
* Approve schedule
