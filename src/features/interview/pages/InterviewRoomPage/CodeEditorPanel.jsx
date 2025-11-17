import { Box, Button, CircularProgress, IconButton, MenuItem, Select, Stack, Tooltip, Typography } from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ClearIcon from "@mui/icons-material/Clear";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Editor from "@monaco-editor/react";

function CodeEditorPanel({
    languages,
    language,
    handleLanguageChange,
    code,
    handleCodeChange,
    formatCode,
    runCode,
    isRunning,
    consoleOutput,
    setConsoleOutput,
    testResults,
    setTestResults,
    user,
    handleEditorMount 
}) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                minHeight: 0,
                border: "1px solid #ccc",
                borderRadius: 1,
            }}
        >
            {/* Toolbar */}
            <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ px: 1, py: 0.5, borderBottom: "1px solid #ccc", background: "#f9f9f9" }}
            >
                {user?.role === 0 ? (
                    <Select
                        value={language}
                        onChange={handleLanguageChange}
                        size="small"
                        sx={{ minWidth: 120, ".MuiSelect-select": { py: 0.5 } }}
                    >
                        {Object.keys(languages).map((lang) => (
                            <MenuItem key={lang} value={lang}>
                                {lang.charAt(0).toUpperCase() + lang.slice(1)}
                            </MenuItem>
                        ))}
                    </Select>
                ) : (
                    <Typography variant="subtitle2" sx={{ px: 1 }}>
                        Language: <strong>{language.charAt(0).toUpperCase() + language.slice(1)}</strong>
                    </Typography>
                )}
                {user?.role === 0 && (
                    <>
                        <Tooltip title="Format Code (Shift+Alt+F)">
                            <IconButton onClick={formatCode} size="small">
                                <CodeIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Box sx={{ flexGrow: 1 }} />
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={runCode}
                            startIcon={isRunning ? <CircularProgress size={16} color="inherit" /> : <PlayArrowIcon />}
                            disabled={isRunning}
                            sx={{ textTransform: "none" }}
                        >
                            {isRunning ? "Running..." : "Run"}
                        </Button>
                    </>
                )}
            </Stack>

            {/* Editor */}
            <Box sx={{ flex: "1 1 60%", minHeight: 200, position: "relative" }}>
                <Editor
                    height="100%"
                    language={language}
                    value={code}
                    onMount={handleEditorMount}
                    onChange={handleCodeChange}
                    options={{
                        readOnly: user?.role === 1,
                        minimap: { enabled: false },
                        scrollbar: { vertical: "auto", horizontal: "auto" },
                        scrollBeyondLastLine: false,
                        fontSize: 14,
                    }}
                />
            </Box>

            {/* Console */}
            <Box
                sx={{
                    flex: "1 1 40%",
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 100,
                    borderTop: "1px solid #ccc",
                }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    sx={{ p: "4px 8px", background: "#f5f5f5", borderBottom: "1px solid #e0e0e0" }}
                >
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                        Console
                    </Typography>
                    {consoleOutput && (
                        <Typography variant="caption" sx={{ ml: 2, color: "text.secondary" }}>
                            {consoleOutput.executionTime !== undefined &&
                                `Executed in ${consoleOutput.executionTime}ms`}
                        </Typography>
                    )}
                    <Box sx={{ flexGrow: 1 }} />
                    <Tooltip title="Clear Console">
                        <IconButton
                            size="small"
                            onClick={() => {
                                setConsoleOutput(null);
                                setTestResults(null);
                            }}
                            disabled={!consoleOutput && !testResults}
                        >
                            <ClearIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>
                <Box
                    sx={{
                        fontFamily: "monospace",
                        p: 1,
                        backgroundColor: "#fdfdfd",
                        overflowY: "auto",
                        whiteSpace: "pre-wrap",
                        flex: 1,
                    }}
                >
                    {testResults ? (
                        <Stack spacing={2}>
                            {testResults.map((result, index) => (
                                <Paper
                                    key={index}
                                    elevation={1}
                                    sx={{ p: 1.5, bgcolor: result.passed ? "#f0f9f0" : "#fef0f0" }}
                                >
                                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                        {result.passed ? (
                                            <CheckCircleIcon color="success" fontSize="small" />
                                        ) : (
                                            <CancelIcon color="error" fontSize="small" />
                                        )}
                                        <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                                            Test Case {result.testCaseIndex + 1}: {result.passed ? "Passed" : "Failed"}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: "text.secondary", ml: "auto" }}>
                                            {`Executed in ${result.executionTime}ms`}
                                        </Typography>
                                    </Stack>
                                    <Typography variant="caption" display="block" sx={{ color: "text.secondary" }}>
                                        Input: {result.inputSummary}
                                    </Typography>
                                    <Typography variant="caption" display="block" sx={{ color: "text.secondary" }}>
                                        Expected:{" "}
                                        <Typography component="span" variant="caption" sx={{ fontFamily: "monospace" }}>
                                            {result.expectedOutput.join(" OR ")}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="caption" display="block" sx={{ color: "text.secondary" }}>
                                        Got:{" "}
                                        <Typography
                                            component="span"
                                            variant="caption"
                                            sx={{
                                                fontFamily: "monospace",
                                                color: result.passed ? "inherit" : "error.main",
                                            }}
                                        >
                                            {result.actualOutput}
                                        </Typography>
                                    </Typography>
                                </Paper>
                            ))}
                        </Stack>
                    ) : !consoleOutput ? (
                        <Typography variant="body2" sx={{ color: "text.secondary", fontStyle: "italic" }}>
                            Console output will appear here...
                        </Typography>
                    ) : (
                        <>
                            {consoleOutput.stdout && (
                                <Typography
                                    component="pre"
                                    variant="body2"
                                    sx={{
                                        color: consoleOutput.stdout.includes("Compilation failed") ? "red" : "inherit",
                                        whiteSpace: "pre-wrap",
                                        fontFamily: "monospace",
                                    }}
                                >
                                    {consoleOutput.stdout}
                                </Typography>
                            )}
                            {consoleOutput.stderr && (
                                <Typography
                                    component="pre"
                                    variant="body2"
                                    sx={{ color: "red", whiteSpace: "pre-wrap", fontFamily: "monospace" }}
                                >
                                    {consoleOutput.stderr}
                                </Typography>
                            )}
                            {consoleOutput.exception && (
                                <Typography
                                    component="pre"
                                    variant="body2"
                                    sx={{ color: "red", whiteSpace: "pre-wrap", fontFamily: "monospace" }}
                                >
                                    {consoleOutput.exception}
                                </Typography>
                            )}
                        </>
                    )}
                </Box>
            </Box>
        </Box>
    );
}

export default CodeEditorPanel;
