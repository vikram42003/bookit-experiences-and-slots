const LoadingComponent = () => {
  return (
    <div className="flex justify-center items-center text-center">
      <div>
        <p className="text-lg font-semibold text-gray-500 animate-pulse">Loading...</p>
        <p className="text-gray-400 max-w-3xl">
          {
            "Temporary Developer Note - I'm using Render free tier to host the Typescript + Express backend because I cant really host a full fledged express backend on Vercel without converting it to use Vercel's Serverless style, but the Render free tier has 10-20 sec long cold boots. so If its taking a long time to load it's probably because of that, but only the first request should be slow, subsequent requests should be fast."
          }
        </p>
      </div>
    </div>
  );
};

export default LoadingComponent;
