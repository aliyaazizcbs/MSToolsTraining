public record Scenario(int Id, string Description, string Light, bool PedestriansCrossing);

public record ScenarioWithAnswer(int Id, string Description, string Light, bool PedestriansCrossing, string CorrectAction);

public record Rule(string ConditionLight, bool? ConditionPedestrians, string Action);

public record EvaluateRequest(List<Rule> Rules);

public record ScenarioResult(int ScenarioId, string Description, bool Passed, string AppliedAction, string CorrectAction);

public record EvaluateResponse(List<ScenarioResult> Results);

public static class ScenarioLogic
{
    private static readonly ScenarioWithAnswer[] _scenarios =
    [
        new(1, "🚗 You approach a junction. The light is RED. No pedestrians are crossing.", "red",   false, "stop"),
        new(2, "🚗 The light turns GREEN. The crossing ahead is completely clear.",          "green", false, "go"),
        new(3, "🚗 The light is GREEN but a pedestrian has stepped onto the crossing.",      "green", true,  "wait"),
    ];

    public static Scenario[] GetScenarios() =>
        _scenarios.Select(s => new Scenario(s.Id, s.Description, s.Light, s.PedestriansCrossing)).ToArray();

    public static EvaluateResponse Evaluate(EvaluateRequest request)
    {
        var results = new List<ScenarioResult>();

        foreach (var scenario in _scenarios)
        {
            var appliedAction = ApplyRules(request.Rules, scenario) ?? "none";
            results.Add(new ScenarioResult(
                scenario.Id,
                scenario.Description,
                appliedAction == scenario.CorrectAction,
                appliedAction,
                scenario.CorrectAction
            ));
        }

        return new EvaluateResponse(results);
    }

    private static string? ApplyRules(List<Rule> rules, ScenarioWithAnswer scenario)
    {
        foreach (var rule in rules)
        {
            var lightMatch = rule.ConditionLight == "any" || rule.ConditionLight == scenario.Light;
            var pedestriansMatch = rule.ConditionPedestrians == null || rule.ConditionPedestrians == scenario.PedestriansCrossing;
            if (lightMatch && pedestriansMatch)
                return rule.Action;
        }
        return null;
    }
}
