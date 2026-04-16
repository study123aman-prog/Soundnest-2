import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const angularInitialized = useRef(false);

  useEffect(() => {
    if (user) navigate(`/${user.role}`);
  }, [user]);

  useEffect(() => {
    if (angularInitialized.current) return;
    angularInitialized.current = true;

    window.angular.module('signupApp', ['ngMessages'])
      .controller('SignupCtrl', ['$scope', function ($scope) {
        $scope.formData = { name: '', email: '', password: '', confirmPassword: '', role: 'user' };
        $scope.serverError = '';
        $scope.serverSuccess = '';
        $scope.loading = false;

        // Custom password match validator
        $scope.passwordsMatch = function () {
          return $scope.formData.password === $scope.formData.confirmPassword;
        };

        $scope.submitSignup = function () {
          if ($scope.signupForm.$invalid || !$scope.passwordsMatch()) return;
          $scope.loading = true;
          $scope.serverError = '';

          $.ajax({
            url: '/api/auth/signup',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
              name: $scope.formData.name,
              email: $scope.formData.email,
              password: $scope.formData.password,
              role: $scope.formData.role,
            }),
            xhrFields: { withCredentials: true },
            success: function (data) {
              $scope.$apply(function () {
                $scope.loading = false;
                $scope.serverSuccess = 'Account created! Redirecting...';
              });
              window.dispatchEvent(new CustomEvent('signupSuccess', { detail: data.user }));
            },
            error: function (xhr) {
              $scope.$apply(function () {
                $scope.loading = false;
                $scope.serverError = xhr.responseJSON?.message || 'Signup failed';
              });
            }
          });
        };
      }]);

    const el = document.getElementById('ng-signup-form');
    if (el && !el.getAttribute('ng-app')) {
      window.angular.bootstrap(el, ['signupApp']);
    }
  }, []);

  useEffect(() => {
    const handler = (e) => {
      login(e.detail);
      navigate(`/${e.detail.role}`);
    };
    window.addEventListener('signupSuccess', handler);
    return () => window.removeEventListener('signupSuccess', handler);
  }, [login, navigate]);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🎵 Sound Nest</div>
        <p className="auth-subtitle">Create your free account</p>

        <div id="ng-signup-form" ng-controller="SignupCtrl">
          <form name="signupForm" noValidate ng-submit="submitSignup()">

            <div ng-show="serverError" className="alert-spotify alert-error-spotify" ng-bind="serverError"></div>
            <div ng-show="serverSuccess" className="alert-spotify alert-success-spotify" ng-bind="serverSuccess"></div>

            {/* Name */}
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-control" name="name" placeholder="Your full name"
                ng-model="formData.name" required ng-minlength="2" />
              <div ng-messages="signupForm.name.$error" ng-if="signupForm.name.$touched">
                <div className="error-msg" ng-message="required">Name is required.</div>
                <div className="error-msg" ng-message="minlength">Name must be at least 2 characters.</div>
              </div>
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input type="email" className="form-control" name="email" placeholder="name@example.com"
                ng-model="formData.email" required />
              <div ng-messages="signupForm.email.$error" ng-if="signupForm.email.$touched">
                <div className="error-msg" ng-message="required">Email is required.</div>
                <div className="error-msg" ng-message="email">Please enter a valid email.</div>
              </div>
            </div>

            {/* Role */}
            <div className="mb-3">
              <label className="form-label">Account Type</label>
              <select className="form-select" name="role" ng-model="formData.role">
                <option value="user">Normal User</option>
                <option value="premium">Premium User</option>
                <option value="artist">Artist</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" name="password" placeholder="Min 6 characters"
                ng-model="formData.password" required ng-minlength="6" />
              <div ng-messages="signupForm.password.$error" ng-if="signupForm.password.$touched">
                <div className="error-msg" ng-message="required">Password is required.</div>
                <div className="error-msg" ng-message="minlength">Password must be at least 6 characters.</div>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label className="form-label">Confirm Password</label>
              <input type="password" className="form-control" name="confirmPassword" placeholder="Repeat password"
                ng-model="formData.confirmPassword" required />
              <div ng-if="formData.confirmPassword && !passwordsMatch()" className="error-msg">
                Passwords do not match.
              </div>
            </div>

            <button type="submit" className="btn-spotify"
              ng-disabled="signupForm.$invalid || !passwordsMatch() || loading">
              <span ng-show="!loading">CREATE ACCOUNT</span>
              <span ng-show="loading">Creating account...</span>
            </button>
          </form>

          <div className="text-center mt-4" style={{ color: '#b3b3b3', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <a href="/login" style={{ color: 'white', fontWeight: 600 }}>Log in</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
