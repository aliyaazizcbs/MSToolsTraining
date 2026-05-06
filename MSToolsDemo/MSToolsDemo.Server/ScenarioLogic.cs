public record Rule(string ConditionLight, bool? ConditionPedestrians, string Action);

public record ScenarioResult(int ScenarioId, string Description, bool Passed, string AppliedAction, string CorrectAction);

public record EvaluateResponse(List<ScenarioResult> Results);

public static class ScenarioLogic
{
    // The 3 test scenarios — read-only, do not change these
    private static readonly (int Id, string Description, string Light, bool Pedestrians, string CorrectAction)[] _scenarios =
    [
        (1, "🚗 Light is RED — no pedestrians crossing",          "red",   false, "stop"),
        (2, "🚗 Light is GREEN — crossing is completely clear",    "green", false, "go"),
        (3, "🚗 Light is GREEN — pedestrian has stepped out",      "green", true,  "wait"),
    ];

    // TODO: The rules below give the WRONG actions — that's why the driver keeps crashing!
    // Can you fix all three so the driver behaves correctly?
    // Rules are checked top-to-bottom; the first matching rule wins.
    private static readonly Rule[] _rules =
    [
        new("red",   null,  "go"),   // ← Rule 1: light is red  — action should be "stop"
        new("green", false, "stop"), // ← Rule 2: green, clear  — action should be "go"
        new("green", true,  "go"),   // ← Rule 3: green + peds  — action should be "wait"
    ];

    public static EvaluateResponse Evaluate()
    {
        var results = new List<ScenarioResult>();

        foreach (var s in _scenarios)
        {
            var action = ApplyRules(s.Light, s.Pedestrians) ?? "none";
            results.Add(new ScenarioResult(s.Id, s.Description, action == s.CorrectAction, action, s.CorrectAction));
        }

        return new EvaluateResponse(results);
    }

    private static string? ApplyRules(string light, bool pedestrians)
    {
        foreach (var rule in _rules)
        {
            var lightMatch = rule.ConditionLight == "any" || rule.ConditionLight == light;
            var pedestriansMatch = rule.ConditionPedestrians == null || rule.ConditionPedestrians == pedestrians;
            if (lightMatch && pedestriansMatch)
                return rule.Action;
        }
        return null;
    }
}
