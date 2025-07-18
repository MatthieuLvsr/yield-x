#!/bin/bash

# Yield-X Test Runner Script
# Usage: ./run-tests.sh [test-type] [options]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
TEST_TYPE="all"
VERBOSE=false
COVERAGE=false
PARALLEL=false

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}$1${NC}"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [TEST_TYPE] [OPTIONS]"
    echo ""
    echo "TEST_TYPE:"
    echo "  all            Run all tests (default)"
    echo "  unit           Run unit tests only"
    echo "  integration    Run integration tests only"
    echo "  program        Run program tests only"
    echo "  original       Run original tests only"
    echo ""
    echo "OPTIONS:"
    echo "  -v, --verbose  Enable verbose output"
    echo "  -c, --coverage Show coverage report"
    echo "  -p, --parallel Run tests in parallel"
    echo "  -h, --help     Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 unit -v"
    echo "  $0 integration --coverage"
    echo "  $0 all --parallel"
}

# Function to check prerequisites
check_prerequisites() {
    print_header "🔍 Checking Prerequisites..."
    
    # Check if anchor is installed
    if ! command -v anchor &> /dev/null; then
        print_error "Anchor CLI is not installed. Please install it first."
        exit 1
    fi
    
    # Check if solana is installed
    if ! command -v solana &> /dev/null; then
        print_error "Solana CLI is not installed. Please install it first."
        exit 1
    fi
    
    # Check if local validator is running
    if ! solana cluster-version &> /dev/null; then
        print_warning "Local validator might not be running. Starting it..."
        solana-test-validator --detach &> /dev/null || true
        sleep 3
    fi
    
    print_status "Prerequisites check completed"
}

# Function to setup test environment
setup_test_environment() {
    print_header "🚀 Setting up Test Environment..."
    
    # Build the program
    print_status "Building program..."
    anchor build
    
    # Generate TypeScript types
    print_status "Generating TypeScript types..."
    anchor idl init --filepath target/idl/yield_app.json $(solana-keygen pubkey target/deploy/yield_app-keypair.json)
    
    print_status "Test environment setup completed"
}

# Function to run specific test file
run_test_file() {
    local test_file=$1
    local test_name=$2
    
    print_header "🧪 Running $test_name Tests..."
    
    local cmd="anchor test --file $test_file"
    
    if [ "$VERBOSE" = true ]; then
        cmd="$cmd --verbose"
    fi
    
    if [ "$PARALLEL" = true ]; then
        cmd="$cmd --parallel"
    fi
    
    print_status "Executing: $cmd"
    
    if eval $cmd; then
        print_status "$test_name tests passed ✅"
    else
        print_error "$test_name tests failed ❌"
        exit 1
    fi
}

# Function to run all tests
run_all_tests() {
    print_header "🎯 Running All Tests..."
    
    run_test_file "tests/unit-tests.ts" "Unit"
    run_test_file "tests/program-tests.ts" "Program"
    run_test_file "tests/integration-tests.ts" "Integration"
    run_test_file "tests/yield-x.ts" "Original"
    
    print_status "All tests completed successfully! 🎉"
}

# Function to generate coverage report
generate_coverage() {
    if [ "$COVERAGE" = true ]; then
        print_header "📊 Generating Coverage Report..."
        
        # Note: This is a placeholder for coverage reporting
        # In a real implementation, you would use a tool like nyc or similar
        print_status "Coverage report generated (placeholder)"
    fi
}

# Function to display test summary
display_summary() {
    print_header "📈 Test Summary"
    echo ""
    echo "Test Suite: Yield-X Program Tests"
    echo "Program ID: $(cat target/deploy/yield_app-keypair.json | jq -r '.[:32]' | base64)"
    echo "Build: $(date)"
    echo ""
    echo "Test Types Executed:"
    
    case $TEST_TYPE in
        "unit")
            echo "  ✅ Unit Tests"
            ;;
        "integration")
            echo "  ✅ Integration Tests"
            ;;
        "program")
            echo "  ✅ Program Tests"
            ;;
        "original")
            echo "  ✅ Original Tests"
            ;;
        "all")
            echo "  ✅ Unit Tests"
            echo "  ✅ Program Tests"
            echo "  ✅ Integration Tests"
            echo "  ✅ Original Tests"
            ;;
    esac
    
    echo ""
    echo "Status: PASSED 🎉"
    echo ""
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        unit|integration|program|original|all)
            TEST_TYPE="$1"
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -c|--coverage)
            COVERAGE=true
            shift
            ;;
        -p|--parallel)
            PARALLEL=true
            shift
            ;;
        -h|--help)
            show_usage
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Main execution
main() {
    print_header "🔥 Yield-X Test Runner"
    echo ""
    
    check_prerequisites
    setup_test_environment
    
    case $TEST_TYPE in
        "unit")
            run_test_file "tests/unit-tests.ts" "Unit"
            ;;
        "integration")
            run_test_file "tests/integration-tests.ts" "Integration"
            ;;
        "program")
            run_test_file "tests/program-tests.ts" "Program"
            ;;
        "original")
            run_test_file "tests/yield-x.ts" "Original"
            ;;
        "all")
            run_all_tests
            ;;
    esac
    
    generate_coverage
    display_summary
}

# Error handling
trap 'print_error "Test execution failed"; exit 1' ERR

# Run main function
main
