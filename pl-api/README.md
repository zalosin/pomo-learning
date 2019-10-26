#Login

POST to `/login`

x-www-formurlencoded

```
{
    username: <<VALUE>>,
    password: <<VALUE>>
}
```

returns on success status 200
```
{
    success:true
}
```
return on fail status 404
```
{
    error:"Username or password invalid",
    success:false
}
```