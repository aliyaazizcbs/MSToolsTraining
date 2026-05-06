var builder = WebApplication.CreateBuilder(args);

// Add service defaults & Aspire client integrations.
builder.AddServiceDefaults();

// Add services to the container.
builder.Services.AddProblemDetails();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}


string[] summaries = ["Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"];

var api = app.MapGroup("/api");
api.MapGet("weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

api.MapPost("trafficlight/next", (TrafficLightRequest req) =>
{
    var next = TrafficLightLogic.GetNextLight(req.Current);
    return Results.Ok(new TrafficLightResponse(next));
})
.WithName("GetNextTrafficLight");

api.MapGet("scenarios", () => Results.Ok(ScenarioLogic.GetScenarios()))
   .WithName("GetScenarios");

api.MapPost("scenarios/evaluate", (EvaluateRequest req) => Results.Ok(ScenarioLogic.Evaluate(req)))
   .WithName("EvaluateScenarios");

app.MapDefaultEndpoints();

app.UseFileServer();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}

record TrafficLightRequest(string Current);
record TrafficLightResponse(string Light);
