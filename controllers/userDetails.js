export async function userDetails(request, response) {
  try {

    const user = request.user;

    return response.status(200).json({
      message: "user details",
      data: user,
    });
    
  } 
  catch (error) 
  {
    return response.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}
